import { EntityABI } from '../constants/abi';
import { mintAccessToken } from '../utils/contract';
import Moralis from 'moralis';
import OnChainEntity from '../contract/OnChainEntity';
import OnChainEntityFactory from '../contract/OnChainEntityFactory';
import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { storeMetadata } from '../utils';
import { Indexor } from '../indexor';
import { MoralisStream } from '../../types';
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
      [
        {
          contractAddress: address,
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
    await Ceramic.initialize('http://localhost:7007'); // client not available have
    await Ceramic.authenticate(symmetricKey);
    return encryptedKey;
  }

  static async createCommon(name: string) {
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
      { tags: ['entity'] }
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

    return {
      entityAddress,
      url,
      streamId,
      encryptedKey,
    };
  }

  static async create(userAddress: string, name: string) {
    try {
      /** Create entity on chain using factory contract */
      const { entityAddress, url, streamId, encryptedKey } =
        await Entity.createCommon(name);
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

  static async getEntityData(entityAddress: string) {
    const params = { entityAddress };
    const streams: MoralisStream[] = await Moralis.Cloud.run(
      'getEntityStreams',
      params
    );
    console.log({ streams });
    const data: {
      [key: string]: any;
    } = await Ceramic.getMultipleStreams(streams.map((s) => s.streamId));

    const entityData: {
      [key: string]: {
        appId: string;
        name: string;
        schemaName: string;
        streams: any[];
      };
    } = {};
    // group streams by namespace
    streams.map((s) => {
      const streamData = data[s.streamId];
      if (entityData[s.appId]) {
        entityData[s.appId].streams.push(streamData);
      } else {
        entityData[s.appId] = {
          appId: s.appId,
          name: s.namespace[0].appName,
          schemaName: s.namespace[0].schemaName,
          streams: [streamData],
        };
      }
    });

    return entityData;
  }

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

    await Indexor.addIndex('EntityMapping', {
      entityAddress,
      userAddress: userAddress.toLowerCase(),
      encryptedSymmetricKey: result.get('encryptedSymmetricKey'),
      streamId: result.get('streamId'),
      url: result.get('url'),
    });
    console.log({ res });

    return res;
  }

  static async hasAccess(entityAddress: string, userAddress: string) {
    const result = await Indexor.queryOneIndex('EntityMapping', {
      entityAddress,
      userAddress: userAddress.toLowerCase(),
    });
    if (!result) {
      return false;
    }
    return true;
  }
}
