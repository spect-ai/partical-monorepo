import { Schema } from '@partical/partical-js-sdk';
import React from 'react';

export function useSchema() {
  const getSchemaByApp = React.useCallback(async (appId: string) => {
    if (!appId) return;
    const res = await Schema.getByAppId(appId);
    return res;
  }, []);

  const getSchemas = React.useCallback(async (schemaIds: string[]) => {
    if (schemaIds.length === 0) return;
    const res = await Schema.get(schemaIds);
    return res;
  }, []);

  const createSchema = React.useCallback(
    async (
      $schema: any,
      title: string,
      type: string,
      properties: object,
      appId: string,
      required: string[]
    ) => {
      if (!appId) return;
      const res = await Schema.create(
        $schema,
        title,
        type,
        properties,
        appId,
        required
      );
      return res;
    },
    []
  );

  const addToCeramic = React.useCallback(
    async (entityAddress: string, appId: string, schemaIds?: string[]) => {
      const res = await Schema.addToCeramic(entityAddress, appId, schemaIds);
      return res;
    },
    []
  );

  return {
    getSchemas,
    getSchemaByApp,
    createSchema,
    addToCeramic,
  };
}
