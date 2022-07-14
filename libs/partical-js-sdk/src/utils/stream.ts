// Import the client
import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import KeyResolver from 'key-did-resolver';

// Connect to a Ceramic node

export async function authenticateCeramic(seed: Uint8Array, ceramic: any) {
  console.log(seed);
  const provider = new Ed25519Provider(seed) as any;
  console.log(provider);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  console.log(did);
  // Authenticate the DID with the provider
  await did.authenticate();
  // The Ceramic client can create and update streams using the authenticated DID
  ceramic.did = did;
}

export async function createStream(content: any, ceramic: any) {
  // The following call will fail if the Ceramic instance does not have an authenticated DID
  const doc = await TileDocument.create(ceramic, content);
  // The stream ID of the created document can then be accessed as the `id` property
  console.log(doc.id.toString());
  return doc.id.toString();
}

export async function getStream(streamId: string, ceramic: any) {
  const doc = await TileDocument.load(ceramic, streamId);
  const content = doc.content as any;
  return content;
}

export async function updateStream(
  streamId: string,
  content: any,
  ceramic: any
) {
  const doc = await TileDocument.load(ceramic, streamId);
  const docContent = doc.content as any;
  await doc.update({
    ...docContent,
    ...content,
  });
}

export async function getMultipleStreams(streamIds: string[], ceramic: any) {
  const queries = streamIds.map((streamId) => ({ streamId }));
  // This will return an Object of stream ID keys to stream values
  return await ceramic.multiQuery(queries);
}

export async function getCommit(stream: any) {
  return stream;
}
