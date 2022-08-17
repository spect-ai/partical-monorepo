import { CeramicClient } from '@ceramicnetwork/http-client';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import KeyResolver from 'key-did-resolver';
import { TileDocument, TileMetadataArgs } from '@ceramicnetwork/stream-tile';

export class Ceramic {
  static ceramicClient: CeramicClient;

  static initialize(_ceramicClientUri?: string) {
    this.ceramicClient = new CeramicClient(_ceramicClientUri);
    return this.ceramicClient;
  }

  static async authenticate(seed: Uint8Array) {
    const provider = new Ed25519Provider(seed) as any;
    const did = new DID({ provider, resolver: KeyResolver.getResolver() });
    await did.authenticate();
    console.log(did);
    this.ceramicClient.did = did;
    return did;
  }

  static async createStream(content: any, args?: TileMetadataArgs) {
    console.log({ content, args });
    const doc = await TileDocument.create(this.ceramicClient, content, args);
    console.log(doc.id.toString());
    return doc.id.toString();
  }

  static async createSchema(schema: any) {
    const doc = await TileDocument.create(this.ceramicClient, schema);
    return doc.commitId.toString();
  }

  static async getStream<T>(streamId: string) {
    const doc = await TileDocument.load(this.ceramicClient, streamId);
    const content = doc.content as T;
    const metadata = doc.metadata;
    return {
      content,
      metadata,
    };
  }

  static async updateStream<T>(streamId: string, content: Partial<T>) {
    const doc = await TileDocument.load(this.ceramicClient, streamId);
    console.log({ doc });
    const docContent = doc.content as T;
    try {
      await doc.update({
        ...docContent,
        ...content,
      });
      console.log('updatedd!!!');
      return doc.content as T;
    } catch (e) {
      return undefined;
    }
  }

  static async getMultipleStreams(streamIds: string[]) {
    const queries = streamIds.map((streamId) => ({ streamId }));
    return await this.ceramicClient.multiQuery(queries);
  }

  static async getCommit(streamId: string) {
    const doc = await TileDocument.load(this.ceramicClient, streamId);
    return doc.commitId.toString();
  }
}
