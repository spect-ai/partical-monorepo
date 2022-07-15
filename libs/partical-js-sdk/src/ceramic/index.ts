import { CeramicClient } from '@ceramicnetwork/http-client';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import KeyResolver from 'key-did-resolver';
import { TileDocument } from '@ceramicnetwork/stream-tile';

export default class Ceramic {
  static ceramicClient: any;

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
  }

  static async createStream(content: any) {
    const doc = await TileDocument.create(this.ceramicClient, content);
    console.log(doc.id.toString());
    return doc.id.toString();
  }

  static async getStream(streamId: string, ceramic: any) {
    const doc = await TileDocument.load(ceramic, streamId);
    const content = doc.content as any;
    return content;
  }

  static async updateStream(streamId: string, content: any, ceramic: any) {
    const doc = await TileDocument.load(ceramic, streamId);
    const docContent = doc.content as any;
    await doc.update({
      ...docContent,
      ...content,
    });
  }

  static async getMultipleStreams(streamIds: string[], ceramic: any) {
    const queries = streamIds.map((streamId) => ({ streamId }));
    return await ceramic.multiQuery(queries);
  }

  static async getCommit(stream: any) {
    return stream;
  }
}
