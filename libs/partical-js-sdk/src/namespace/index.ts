import OnChainEntity from '../contract/OnChainEntity';
import { Indexor } from '../indexor';
import { generateKey } from '../utils';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NamespaceMetadata } from 'libs/partical-js-sdk/types';
import { v4 as uuidv4 } from 'uuid';

export class Namespace {
  static async create(appName: string): Promise<{
    key: string;
    appId: string;
  }> {
    const key = generateKey();
    console.log({ key });
    /** Update entity's on chain uri with new ipfs uri */
    const appId = uuidv4();
    console.log('On chain entity created');
    await Indexor.addIndex('Namespace', {
      appName,
      key,
      appId,
    });

    return {
      key,
      appId,
    };
  }

  static async get(appId: string): Promise<NamespaceMetadata> {
    // TODO filter keys for unauthorized users
    const result = await Indexor.queryOneIndex('Namespace', {
      appId,
    });
    if (!result) {
      return {} as NamespaceMetadata;
    }
    return {
      objectId: result.id,
      appName: result.get('appName'),
      schemaName: result.get('schemaName'),
      key: result.get('key'),
      appId: result.get('appId'),
    };
  }

  static async getByUser(userAddress: string): Promise<NamespaceMetadata[]> {
    const results = await Indexor.queryIndex('Namespace', {
      userAddress,
    });
    if (!results) {
      return [] as NamespaceMetadata[];
    }

    const res = results.map((item) => {
      return {
        objectId: item.id,
        appName: item.get('appName'),
        schemaName: item.get('schemaName'),
        key: item.get('key'),
        appId: item.get('appId'),
      };
    });
    console.log({ res });
    return res;
  }
}
