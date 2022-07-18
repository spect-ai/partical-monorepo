import { EntityABI } from '../constants/abi';
import { mintAccessToken } from '../utils/contract';
import Moralis from 'moralis';
import OnChainEntity from '../contract/OnChainEntity';
import OnChainEntityFactory from '../contract/OnChainEntityFactory';
import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { storeMetadata } from '../utils';
import { Indexor } from '../indexor';
import { Schema } from '../schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LitJsSdk = require('lit-js-sdk');

const chain = 'rinkeby';
const standardContractType = 'ERC1155';
export class Entity {
  constructor() {
    if (!OnChainEntityFactory.contract) OnChainEntityFactory.initContract();
  }

  private static async _generateKeyAndAuthenticate(address: string) {
    const { symmetricKey }: any = await Lit.checkAndSignAuthMessage('encrypt');
    const encryptedKey = await Lit.saveKey(
      Lit.basicAccessControlCondition(address),
      symmetricKey
    );
    await Ceramic.initialize('http://localhost:7007'); // client not available have
    await Ceramic.authenticate(symmetricKey);
    return encryptedKey;
  }

  static async create(userAddress: string, name: string) {
    try {
      /** Create entity on chain using factory contract */
      console.log('Creating entity ..');
      const data = await OnChainEntity.create('');
      const entityAddress = data.events[1].args.entity;
      OnChainEntity.initContract(entityAddress);

      const encryptedKey = await Entity._generateKeyAndAuthenticate(
        entityAddress
      );

      const streamId = await Ceramic.createStream(
        {
          contractAddress: entityAddress,
          appData: [],
        },
        { tags: ['entity'] },
        'partical-main'
      );
      console.log(`streamId: ${streamId}`);

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

    const result = await Indexor.queryOneIndex('EntityMapping', {
      entityAddress,
    });
    if (!result) {
      throw new Error('Entity not found');
    }

    const mappedEntity = await Indexor.addIndex('EntityMapping', {
      entityAddress,
      userAddress: userAddress.toLowerCase(),
      encryptedSymmetricKey: result.get('encryptedSymmetricKey'),
      streamId: result.get('streamId'),
      url: result.get('url'),
    });
    console.log({ res });

    return res;
  }
}
