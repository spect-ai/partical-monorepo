import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { Indexor } from '../indexor';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import Moralis from 'moralis';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LitJsSdk = require('lit-js-sdk');
export class Schema {
  static async create(
    $schema: any,
    title: string,
    type: string,
    properties: object,
    appId: string,
    required: string[]
  ): Promise<boolean> {
    const namespace = await Indexor.queryOneIndex('Namespace', {
      appId,
    });
    if (!namespace) {
      return false;
    }
    const symmetricKey = await Lit.descryptKey(
      namespace.get('encryptedSymmetricKey'),
      namespace.get('entityAddress')
    );
    /** Authenticate using symmetric key and create key did */
    await Ceramic.authenticate(symmetricKey);
    const streamId = Ceramic.createStream(
      {
        $schema,
        title,
        type,
        properties,
        appId,
        required,
      },
      {
        tags: [appId],
        family: appId,
      }
    );
    await Indexor.addIndex('Schema', {
      streamId,
      appId,
    });

    return true;
  }

  static async get(schemaIds: string[]): Promise<any[]> {
    const IndexorObj = Moralis.Object.extend('Schema');
    const queryObj = new Moralis.Query(IndexorObj);
    queryObj.containedIn('objectId', schemaIds);
    const results = await queryObj.find();
    if (!results) {
      return {} as any;
    }
    return results.map((result) => {
      return {
        $schema: result.get('$schema'),
        title: result.get('title'),
        type: result.get('type'),
        properties: result.get('properties'),
        appId: result.get('appId'),
        required: result.get('required'),
      };
    });
  }

  static async getByAppId(appId: string): Promise<any[]> {
    const results = await Indexor.queryIndex('Schema', {
      appId,
    });
    if (!results) {
      return {} as any;
    }
    return results.map((result) => {
      return {
        $schema: result.get('$schema'),
        title: result.get('title'),
        type: result.get('type'),
        properties: result.get('properties'),
        appId: result.get('appId'),
        required: result.get('required'),
      };
    });
  }
}
