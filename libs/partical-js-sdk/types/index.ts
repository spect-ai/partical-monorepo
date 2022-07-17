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
