// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NamespaceMetadata } from 'libs/partical-js-sdk/types';
import { v4 as uuidv4 } from 'uuid';
import { Indexor } from '../indexor';
import { generateKey } from '../utils';
export class Namespace {
  static async create(
    appName: string,
    schemaName: string
  ): Promise<{
    key: string;
    appId: string;
  }> {
    const key = generateKey();
    console.log({ key });
    const appId = uuidv4();
    await Indexor.addIndex('Namespace', {
      appName,
      schemaName,
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
}
