import { EntityABI } from '../constants/abi';
import { mintAccessToken } from '../utils/contract';
import Moralis from 'moralis';
import OnChainEntity from '../contract/OnChainEntity';
import OnChainEntityFactory from '../contract/OnChainEntityFactory';
import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { storeMetadata } from '../utils';
import { Indexor } from '../indexor';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LitJsSdk = require('lit-js-sdk');

const chain = 'rinkeby';
const standardContractType = 'ERC1155';
export class Entity {
  constructor() {
    if (!OnChainEntityFactory.contract) OnChainEntityFactory.initContract();
  }

  static async create(userAddress: string, name: string) {
    try {
      /** Create entity on chain using factory contract */
      console.log('Creating entity ..');
      const data = await OnChainEntity.create('');
      const entityAddress = data.events[1].args.entity;
      OnChainEntity.initContract(entityAddress);

      /** Create symmetric to be used as seed for ceramic key controller */
      const { symmetricKey }: any = await Lit.checkAndSignAuthMessage(
        'encrypt'
      );
      /** Authenticate using symmetric key and create key did */
      await Ceramic.initialize('http://localhost:7007'); // client not available have
      await Ceramic.authenticate(symmetricKey);
      const streamId = await Ceramic.createStream(
        {
          contractAddress: entityAddress,
          appData: [],
        },
        ['entity'],
        'partical-main'
      );
      console.log(`streamId: ${streamId}`);
      const encryptedKey = await Lit.saveKey(
        [
          {
            contractAddress: entityAddress,
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
        symmetricKey
      );
      /** Update entity's on chain uri with new ipfs uri */
      const url = await storeMetadata(
        name,
        LitJsSdk.uint8arrayToString(encryptedKey, 'base16'),
        streamId
      );
      console.log({ url });

      /** Update entity's on chain uri with new ipfs uri */
      await OnChainEntity.update(url);
      console.log('On chain entity created');

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
        name,
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
    return entities;
  }

  // static async getAppData(entityAddress: string) {
  //   Ceramic.initialize();

  //   const entities = await Indexor.queryIndex('EntityMapping', {
  //     entityAddress,
  //   });

  //   const baseData = await Ceramic.getStream(entities[0].get('streamId'));
  //   const appStreamObj = await Ceramic.getMultipleStreams(baseData.appData);

  //   const appData = Object.keys(appStreamObj).map((key) => {
  //     const stream = appStreamObj[key];
  //     const content = stream.content as any;
  //     return { ...content, streamId: key };
  //   });
  //   return {
  //     ...baseData,
  //     appData,
  //   };
  // }

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
