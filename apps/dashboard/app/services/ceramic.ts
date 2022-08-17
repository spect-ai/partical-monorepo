import CeramicClient from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';

export const loadDocument = async (streamId: string) => {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  const doc = await TileDocument.load(ceramic as any, streamId);
  return doc;
};
