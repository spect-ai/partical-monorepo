export type NamespaceMetadata = {
  objectId: string;
  appName: string;
  schemaName: string;
  key?: string;
  appId: string;
};

export type StreamIndex = {
  objectId: string;
  streamId: string;
  entityAddress: string;
  appId: string;
  schemaName: string;
  tags: string[];
  schema: object; // TODO: type this
};

export type Entity = {
  objectId: string;
  entityAddress: string;
  streamId: string;
  url: string;
  userAddress: string;
  encryptedSymmetricKey: string;
};

export interface MoralisNamespace {
  appId: string;
  appName: string;
  key: string;
  schemaName: string;
  _id: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface MoralisStream {
  appId: string;
  createdAt: string;
  entityAddress: string;
  namespace: MoralisNamespace[];
  objectId: string;
  streamId: string;
  updatedAt: string;
}
