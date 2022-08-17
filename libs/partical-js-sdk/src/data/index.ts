import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { Indexor } from '../indexor';
import { TileMetadataArgs } from '@ceramicnetwork/stream-tile';
import { DependencyResolver } from '../../types';

export class Data {
  static async createData<T>(
    data: T,
    appId: string,
    tags: string[],
    entityAddress: string,
    encryptedSymmetricKey: string,
    schemaCommitId?: string
  ): Promise<string | undefined> {
    try {
      console.log({ encryptedSymmetricKey, entityAddress });
      const symmetricKey = await Lit.descryptKey(
        encryptedSymmetricKey,
        entityAddress
      );
      console.log('schemaStreamId', schemaCommitId);
      /** Authenticate using symmetric key and create key did */
      await Ceramic.authenticate(symmetricKey);
      let args: TileMetadataArgs = { tags };
      if (schemaCommitId)
        args = {
          ...args,
          schema: schemaCommitId,
          family: entityAddress,
        };
      const streamId = await Ceramic.createStream(data, args);
      await Indexor.addIndex('StreamIndexer', {
        streamId,
        entityAddress,
        appId,
      });
      return streamId;
    } catch (e) {
      console.log({ e });
      return undefined;
    }
  }

  static async getAppData<T>(appId: string): Promise<T[]> {
    Lit.connect();
    Ceramic.initialize();
    const results = await Indexor.queryIndex('StreamIndexer', {
      appId,
    });
    console.log('results', results);
    const streamIds = results.map((result) => result.get('streamId'));
    console.log({ streamIds });
    const streamObj = await Ceramic.getMultipleStreams(streamIds);
    const data = Object.keys(streamObj).map((key) => {
      const stream = streamObj[key];
      const content = stream.content as any;
      return { ...content, streamId: key };
    });
    console.log({ data });
    return data;
  }

  static async updateData<T>(
    streamId: string,
    data: T,
    entityAddress: string,
    encryptedSymmetricKey: string
  ): Promise<T | undefined> {
    try {
      await Ceramic.initialize('https://ceramic-clay.3boxlabs.com');
      await Lit.connect();
      console.log({ encryptedSymmetricKey, entityAddress });
      const symmetricKey = await Lit.descryptKey(
        encryptedSymmetricKey,
        entityAddress
      );
      console.log('symmetricKey', symmetricKey);
      /** Authenticate using symmetric key and create key did */
      await Ceramic.authenticate(symmetricKey);
      return await Ceramic.updateStream(streamId, data);
    } catch (e) {
      console.log({ e });
      return undefined;
    }
  }

  // const dependencyResolver: Schema = {
  //   '0be7a9c7-c6d2-44f3-8fed-1766ed3600fb': [
  //     {
  //       name: 'entityAddress',
  //       alias: 'entityAddress',
  //     },
  //     {
  //       name: 'description',
  //       alias: 'description',
  //     },
  //     {
  //       name: 'title',
  //       alias: 'title',
  //     },
  //     {
  //       name: 'image',
  //       alias: 'image',
  //     },
  //     {
  //       name: 'website',
  //       alias: 'website',
  //     },
  //     {
  //       name: 'fundingAddress',
  //       alias: 'fundingAddress',
  //     },
  //   ],
  //   '8d81462f-816c-404c-9efa-51c6e2a80fa8': [
  //     {
  //       name: 'name',
  //       alias: 'daoName',
  //     },
  //     {
  //       name: 'about',
  //       alias: 'daoAbout',
  //     },
  //   ],
  // };

  static async getViewData<T>(appId: string, streamId: string) {
    const app = await Indexor.queryOneIndex('Namespace', { appId });
    const dependencyResolver = app?.get('resolver') as DependencyResolver;

    const stream = await Indexor.queryOneIndex('StreamIndexer', {
      streamId,
    });
    const entityAddress = stream?.get('entityAddress');
    const viewData: any = {};
    console.log({ stream, app });
    console.log({ dependencyResolver });

    await Promise.all(
      Object.keys(dependencyResolver).map(async (appId) => {
        console.log({ appId });
        if (appId === stream?.get('appId')) {
          const { content }: any = await Ceramic.getStream(streamId);
          dependencyResolver[appId].forEach(async (dependency) => {
            viewData[dependency.alias] = content[dependency.name];
          });
        } else {
          const appStream = await Indexor.queryOneIndex('StreamIndexer', {
            appId,
            entityAddress,
          });
          if (appStream) {
            const { content }: any = await Ceramic.getStream(
              appStream?.get('streamId')
            );
            console.log({ content });
            dependencyResolver[appId].forEach(async (dependency) => {
              viewData[dependency.alias] = content[dependency.name];
            });
          }
        }
      })
    );
    console.log({ viewData });
    return viewData as T;
  }
}
