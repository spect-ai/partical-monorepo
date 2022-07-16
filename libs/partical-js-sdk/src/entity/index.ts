import { EntityABI, FactoryABI } from '../constants/abi';
import { contractAddress } from '../constants/address';
import { createEntity, mintAccessToken } from '../utils/contract';
import litprotocol from '../utils/litprotocol';
import Moralis from 'moralis';
import { getMultipleStreams, getStream, updateStream } from '../utils/stream';
import { CeramicClient } from '@ceramicnetwork/http-client';
import OnChainEntity from '../contract/OnChainEntity';
import OnChainEntityFactory from '../contract/OnChainEntityFactory';
import Lit from '../lit';
import Ceramic from '../ceramic';
import { storeMetadata } from '../utils';
import LitJsSdk from 'lit-js-sdk';
import { Indexor } from '../indexor';

const standardContractType = 'ERC1155';
const chain = 'rinkeby';
export class Entity {
  constructor() {
    if (!OnChainEntityFactory.contract) OnChainEntityFactory.initContract();
  }

  static async initialize(userAddress: string) {
    try {
      /** TODO: Move this to Partical client */
      OnChainEntityFactory.initContract();
      Lit.connect();
      Ceramic.initialize();

      /** Create entity on chain using factory contract */
      const data = await OnChainEntity.create('');
      const entityAddress = data.events[1].args.entity;
      OnChainEntity.initContract(entityAddress);

      /** Create symmetric to be used as seed for ceramic key controller */
      const { encryptedString, symmetricKey }: any =
        await Lit.checkAndSignAuthMessage('encrypt');

      /** Authenticate using symmetric key and create key did */
      await Ceramic.authenticate(symmetricKey);
      const streamId = await Ceramic.createStream({
        contractAddress,
        appData: [],
      });

      const encryptedKey = await Lit.saveKey(
        [
          {
            contractAddress,
            standardContractType,
            chain,
            method: 'balanceOf',
            parameters: [':userAddress', '0'],
            returnValueTest: {
              comparator: '>',
              value: '0',
            },
          },
        ],
        encryptedString
      );

      /** Update entity's on chain uri with new ipfs uri */
      const url = await storeMetadata(encryptedKey, streamId);

      /** Update entity's on chain uri with new ipfs uri */
      await OnChainEntity.update(url);

      /** Add index in moralis for entity */
      return await Indexor.addIndex('EntityMapping', {
        entityAddress,
        userAddress,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
          encryptedKey,
          'base16'
        ),
        streamId,
        url,
      });
    } catch (e) {
      console.log({ e });
      return false;
    }
  }

  static async getByUser(userAddress: string) {
    const entities = await Indexor.queryIndex('EntityMapping', {
      userAddress: userAddress.toLowerCase(),
    });
    return entities[0];
  }

  static async getAppData(entityAddress: string) {
    Ceramic.initialize();

    const entities = await Indexor.queryIndex('EntityMapping', {
      entityAddress,
    });

    const baseData = await Ceramic.getStream(entities[0].get('streamId'));
    const appStreamObj = await Ceramic.getMultipleStreams(baseData.appData);

    const appData = Object.keys(appStreamObj).map((key) => {
      const stream = appStreamObj[key];
      const content = stream.content as any;
      return { ...content, streamId: key };
    });
    return {
      ...baseData,
      appData,
    };
  }

  static async giveAccess(entityAddress: string, userAddress: string) {
    const res = await mintAccessToken(
      entityAddress,
      userAddress,
      EntityABI.abi
    );

    const EntityMapping = Moralis.Object.extend('EntityMapping');
    const query = new Moralis.Query(EntityMapping);
    query.equalTo('entityAddress', entityAddress);
    const results = await query.find();

    const entityMapping = new EntityMapping();

    entityMapping.set('entityAddress', entityAddress);
    entityMapping.set(
      'encryptedSymmetricKey',
      results[0].get('encryptedSymmetricKey')
    );
    entityMapping.set('url', results[0].get('url'));
    entityMapping.set('streamId', results[0].get('streamId'));
    entityMapping.set('userAddress', userAddress.toLowerCase());

    await entityMapping.save();
    console.log({ res });
    return res;
  }
}
