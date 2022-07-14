import { Base } from '../base';
import LitJsSdk from 'lit-js-sdk';
import {
  authenticateCeramic,
  createStream,
  getMultipleStreams,
} from '../utils/stream';
import { CeramicClient } from '@ceramicnetwork/http-client';
import Moralis from 'moralis';
import { TileDocument } from '@ceramicnetwork/stream-tile';

const standardContractType = 'ERC1155';
const chain = 'rinkeby';

export class StreamData extends Base {
  async createStreamData(
    entityAddress: string,
    streamId: string,
    encryptedSymmetricKey: string,
    data: any
  ) {
    const EntityMapping = Moralis.Object.extend('Namespace');
    const query = new Moralis.Query(EntityMapping);
    query.equalTo('key', this.apiKey);
    const results = await query.find();
    const app = results[0];
    if (!app) {
      throw new Error('App not found');
    }

    const client = new LitJsSdk.LitNodeClient();
    const ceramic = new CeramicClient('http://localhost:7007');

    await client.connect();

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    const accessControlConditions = [
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
    ];
    console.log({ accessControlConditions });
    console.log(encryptedSymmetricKey);
    const symmetricKey = await client.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });

    await authenticateCeramic(symmetricKey, ceramic);
    const dataStreamId = await createStream(data, ceramic);

    const StreamIndexer = Moralis.Object.extend('StreamIndexer');
    const streamIndexer = new StreamIndexer();

    streamIndexer.set('streamId', dataStreamId);
    streamIndexer.set('appId', app.id);
    streamIndexer.set('entityAddress', entityAddress);

    const doc = await TileDocument.load(ceramic, streamId);
    const content = doc.content as any;

    await doc.update({
      ...content,
      appData: [...content.appData, dataStreamId],
    });

    return await streamIndexer.save();
  }

  async updateStreamData(
    encryptedSymmetricKey: string,
    entityAddress: string,
    streamId: string,
    data: any
  ) {
    const client = new LitJsSdk.LitNodeClient();
    const ceramic = new CeramicClient('http://localhost:7007');

    await client.connect();
    const accessControlConditions = [
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
    ];
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await client.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });

    await authenticateCeramic(symmetricKey, ceramic);

    const doc = await TileDocument.load(ceramic, streamId);
    const content = doc.content as any;
    await doc.update({
      ...content,
      ...data,
    });
  }

  async getAppData(appId: string) {
    const StreamIndexer = Moralis.Object.extend('StreamIndexer');
    const query = new Moralis.Query(StreamIndexer);
    query.equalTo('appId', appId);
    const results = await query.find();
    console.log('results', results);
    const streamIds = results.map((result) => result.get('streamId'));
    console.log({ streamIds });
    const ceramic = new CeramicClient('http://localhost:7007');
    const streamObj = await getMultipleStreams(streamIds, ceramic);
    const data = Object.keys(streamObj).map((key) => {
      const stream = streamObj[key];
      const content = stream.content as any;
      return { ...content, streamId: key };
    });
    console.log({ data });
    return data;
  }
}
