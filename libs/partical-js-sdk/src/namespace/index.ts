import Moralis from 'moralis';
import { generateKey, generateSecretHash } from '../utils';

export class Namespace {
  constructor() {
    const serverUrl = 'https://e6ss72rsmosx.usemoralis.com:2053/server';
    const appId = '6F5BP7sxHeCFc3yczy70u0xlF72oS9YQbOygTnoT';

    void Moralis.start({ serverUrl, appId });
  }

  async createNamespace(
    appName: string,
    schemaName: string
  ): Promise<{
    key: string;
  }> {
    const key = generateKey();
    // const secretHash = generateSecretHash(key);

    console.log({ key });

    const Namespace = Moralis.Object.extend('Namespace');
    const namespace = new Namespace();

    namespace.set('appName', appName);
    namespace.set('schemaName', schemaName);
    namespace.set('key', key);

    await namespace.save();

    return {
      key,
    };
  }
}
