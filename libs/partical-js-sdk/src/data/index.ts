import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { Indexor } from '../indexor';
import { TileMetadataArgs } from '@ceramicnetwork/stream-tile';
export class Data {
  static async createData<T>(
    data: T,
    appId: string,
    tags: string[],
    entityAddress: string,
    encryptedSymmetricKey: string,
    schemaStreamId?: string
  ): Promise<string | undefined> {
    try {
      console.log({ encryptedSymmetricKey, entityAddress });
      const symmetricKey = await Lit.descryptKey(
        encryptedSymmetricKey,
        entityAddress
      );
      console.log('schemaStreamId', schemaStreamId);
      /** Authenticate using symmetric key and create key did */
      await Ceramic.authenticate(symmetricKey);
      let args: TileMetadataArgs = { tags };
      if (schemaStreamId)
        args = {
          ...args,
          schema: await Ceramic.getCommit(schemaStreamId),
          family: appId,
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
}
