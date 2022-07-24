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
const chain = 'polygon';

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

  // async createDataFromSchema(content: {
  //   name: string;
  //   description: string;
  //   logo: string;
  //   twitter: string;
  //   facebook: string;
  //   instagram: string;
  //   fundingAddress: string;
  // }) {
  //   interface Schema {
  //     [appId: string]: {
  //       name: string;
  //       alias: string;
  //     }[];
  //   }

  //   // object to store the appid and the columns it uses from the schema

  //   // create a new ceramic client
  //   const ceramic = new CeramicClient('http://localhost:7007');

  //   // create a tile document for each app which contains data required by the app
  //   const appIds = Object.keys(dependencyResolver);
  //   const appData = await Promise.all(
  //     appIds.map(async (appId) => {
  //       const appData: any = {};
  //       const appDataKeys = dependencyResolver[appId];
  //       appDataKeys.forEach((key) => {
  //         appData[key.alias] = content[key.name as keyof typeof content];
  //       });
  //       // const doc = await TileDocument.create(ceramic, appId, appData);
  //       // return doc.id;
  //       console.log({ appData });
  //     })
  //   );
  // }

  async getDataFromSchema() {
    interface Schema {
      [appId: string]: {
        name: string;
        alias: string;
      }[];
    }

    // object to store the appid and the columns it uses from the schema
    const dependencyResolver: Schema = {
      '0be7a9c7-c6d2-44f3-8fed-1766ed3600fb': [
        {
          name: 'entityAddress',
          alias: 'entityAddress',
        },
        {
          name: 'description',
          alias: 'description',
        },
        {
          name: 'title',
          alias: 'title',
        },
        {
          name: 'image',
          alias: 'image',
        },
        {
          name: 'website',
          alias: 'website',
        },
        {
          name: 'fundingAddress',
          alias: 'fundingAddress',
        },
      ],
      '8d81462f-816c-404c-9efa-51c6e2a80fa8': [
        {
          name: 'name',
          alias: 'daoName',
        },
        {
          name: 'about',
          alias: 'daoAbout',
        },
      ],
    };

    // create a new ceramic client
    const ceramic = new CeramicClient('http://localhost:7007');

    // get the data from each of the appId documents and filter out the data that is not required by the app
    const appIds = Object.keys(dependencyResolver);
    const appData = await Promise.all(
      appIds.map(async (appId) => {
        const appData: any = {};
        const appDataKeys = dependencyResolver[appId];
        const doc = await TileDocument.load(ceramic, appId);
        const content = doc.content as any;
        appDataKeys.forEach((key) => {
          appData[key.alias] = content[key.name as keyof typeof content];
        });
        return appData;
      })
    );
    console.log({ appData });
  }

  async updateDataFromSchema(
    content: Partial<{
      name: string;
      description: string;
      logo: string;
      twitter: string;
      facebook: string;
      instagram: string;
      fundingAddress: string;
    }>
  ) {
    interface Schema {
      [appId: string]: string[];
    }

    // object to store the appid and the columns it uses from the schema
    const dependencyResolver: Schema = {
      appId1: ['name', 'description', 'logo'],
      appId2: ['twitter', 'facebook', 'instagram'],
      appId3: ['fundingAddress'],
    };

    // create a new ceramic client
    const ceramic = new CeramicClient('http://localhost:7007');

    // update the document for each app with the content provided based on the schema
    const appIds = Object.keys(dependencyResolver);
    const appData = await Promise.all(
      appIds.map(async (appId) => {
        const appData: any = {};
        const appDataKeys = dependencyResolver[appId];
        appDataKeys.forEach((key) => {
          appData[key] = content[key as keyof typeof content];
        });
        const doc = await TileDocument.load(ceramic, appId);
        const doccontent = doc.content as any;
        await doc.update({
          ...doccontent,
          ...appData,
        });
      })
    );
  }
}
