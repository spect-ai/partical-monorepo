import Lit from '../lit';
import { Ceramic } from '../ceramic';
import { Indexor } from '../indexor';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import Moralis from 'moralis';

export class Schema {
  static async create(
    $schema: any,
    title: string,
    type: string,
    properties: object,
    appId: string,
    required: string[]
  ): Promise<boolean> {
    await Indexor.addIndex('Schema', {
      $schema,
      title,
      type,
      properties,
      appId,
      required,
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

  static async addToCeramic(
    entityAddress: string,
    appId: string,
    schemaIds?: string[]
  ): Promise<string[]> {
    let appSchemas = [];
    if (schemaIds) appSchemas = await Schema.get(schemaIds);
    else appSchemas = await Schema.getByAppId(appId);

    if (!appSchemas) return [];

    const entity = await Indexor.queryOneIndex('EntityMapping', {
      entityAddress,
    });
    if (!entity) {
      throw new Error('Entity not found');
    }

    Ceramic.authenticate(
      await Lit.descryptKey(entity.get('encryptedSymmetricKey'), entityAddress)
    );

    const streamIds = [];
    for (const schema of appSchemas) {
      const streamId = await Ceramic.createSchema(
        { schema: schema, tags: [appId] },
        appId
      );
      Indexor.addIndex('StreamIndexor', {
        streamId,
        appId,
        entityAddress,
      });
      streamIds.push(streamId);
    }
    return streamIds;
  }
}
