import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { Indexor } from '../indexor';
export class Data {
  static async createData<T>(
    data: T,
    appId: string,
    tags: string[],
    entityAddress: string,
    encryptedSymmetricKey: string
  ): Promise<string | undefined> {
    try {
      const symmetricKey = await Lit.descryptKey(
        encryptedSymmetricKey,
        entityAddress
      );
      /** Authenticate using symmetric key and create key did */
      await Ceramic.authenticate(symmetricKey);
      const streamId = await Ceramic.createStream(data, tags, appId);
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
}
