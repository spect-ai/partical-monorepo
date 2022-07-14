import { EntityABI, FactoryABI } from '../constants/abi';
import { contractAddress } from '../constants/address';
import { createEntity, mintAccessToken } from '../utils/contract';
import litprotocol from '../utils/litprotocol';
import Moralis from 'moralis';
import { getMultipleStreams, getStream, updateStream } from '../utils/stream';
import { CeramicClient } from '@ceramicnetwork/http-client';

export class Entity {
  constructor() {
    const serverUrl = 'https://e6ss72rsmosx.usemoralis.com:2053/server';
    const appId = '6F5BP7sxHeCFc3yczy70u0xlF72oS9YQbOygTnoT';

    void Moralis.start({ serverUrl, appId });
  }
  async initializeEntity(userAddress: string) {
    try {
      const data = await createEntity('', contractAddress, FactoryABI.abi);
      console.log({ data });
      const entityAddress = data.events[1].args.entity;
      const { encryptedSymmetricKey, streamId, url }: any =
        await litprotocol.initializeDatastore('encrypt', entityAddress);
      console.log({ encryptedSymmetricKey, streamId, url });
      const EntityMapping = Moralis.Object.extend('EntityMapping');
      const entityMapping = new EntityMapping();

      entityMapping.set('entityAddress', entityAddress);
      entityMapping.set('userAddress', userAddress.toLowerCase());
      entityMapping.set('encryptedSymmetricKey', encryptedSymmetricKey);
      entityMapping.set('streamId', streamId);
      entityMapping.set('url', url);

      const res = await entityMapping.save();

      console.log({ res });

      return res;
    } catch (e) {
      console.log({ e });
      return false;
    }
  }

  async getMyEntity(userAddress: string) {
    const EntityMapping = Moralis.Object.extend('EntityMapping');
    const query = new Moralis.Query(EntityMapping);
    console.log({ userAddress });
    query.equalTo('userAddress', userAddress.toLowerCase());
    const results = await query.find();
    return results[0];
  }

  async getMyAppData(entityAddress: string) {
    const EntityMapping = Moralis.Object.extend('EntityMapping');
    const query = new Moralis.Query(EntityMapping);
    query.equalTo('entityAddress', entityAddress);
    const results = await query.find();
    const ceramic = new CeramicClient('http://localhost:7007');

    const baseData = await getStream(results[0].get('streamId'), ceramic);
    const appStreamObj = await getMultipleStreams(baseData.appData, ceramic);

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

  async giveAccess(entityAddress: string, userAddress: string) {
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
