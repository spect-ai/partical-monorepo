/* eslint-disable @typescript-eslint/no-var-requires */
import { Indexor } from '../indexor';
import { generateKey } from '../utils';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NamespaceMetadata } from 'libs/partical-js-sdk/types';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../entity';
import { Ceramic } from '../ceramic';
const LitJsSdk = require('lit-js-sdk');
const crypto = require('crypto');

export class Namespace {
  static async createApp(
    name: string,
    description: string,
    schema: any,
    userAddress: string
  ) {
    const seed = new Uint8Array(32);
    crypto.randomFillSync(seed);

    await Ceramic.authenticate(seed);

    const schemaCommit = await Ceramic.createSchema(schema);

    const appId = uuidv4();
    await Indexor.addIndex('Namespace', {
      appName: name,
      schema: JSON.stringify(schema),
      schemaCommit,
      appId,
      description,
      owner: userAddress,
      seed,
    });
  }

  static async create(appName: string): Promise<{
    key: string;
    appId: string;
  }> {
    const key = generateKey();
    console.log({ key });
    const { entityAddress, url, streamId, encryptedKey } =
      await Entity.createCommon(appName);
    /** Update entity's on chain uri with new ipfs uri */
    const appId = uuidv4();
    console.log('On chain entity created');
    await Indexor.addIndex('Namespace', {
      appName,
      key,
      appId,
      streamId,
      entityAddress,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedKey,
        'base16'
      ),
    });

    return {
      key,
      appId,
    };
  }

  static async get(appId: string): Promise<NamespaceMetadata> {
    console.log({ appId });

    const item = await Indexor.queryOneIndex('Namespace', {
      appId,
    });
    console.log({ item });
    if (!item) {
      return {} as NamespaceMetadata;
    }
    return {
      objectId: item.id,
      appName: item.get('appName'),
      schema: JSON.parse(item.get('schema')),
      appId: item.get('appId'),
      schemaCommit: item.get('schemaCommit'),
      seed: item.get('seed'),
      description: item.get('description'),
    };
  }

  static async getByUser(userAddress: string): Promise<NamespaceMetadata[]> {
    const results = await Indexor.queryIndex('Namespace', {
      owner: userAddress,
    });
    if (!results) {
      return [] as NamespaceMetadata[];
    }

    const res = results.map((item) => {
      return {
        objectId: item.id,
        appName: item.get('appName'),
        schema: JSON.parse(item.get('schema')),
        appId: item.get('appId'),
        schemaCommit: item.get('schemaCommit'),
        seed: item.get('seed'),
        description: item.get('description'),
      };
    });
    console.log({ res });
    return res;
  }

  static async getAll(): Promise<NamespaceMetadata[]> {
    const results = await Indexor.queryIndex('Namespace', {});
    if (!results) {
      return [] as NamespaceMetadata[];
    }

    const res = results.map((item) => {
      return {
        objectId: item.id,
        appName: item.get('appName'),
        schema: JSON.parse(item.get('schema')),
        appId: item.get('appId'),
        schemaCommit: item.get('schemaCommit'),
        seed: item.get('seed'),
        description: item.get('description'),
      };
    });
    console.log({ res });
    return res;
  }
}
