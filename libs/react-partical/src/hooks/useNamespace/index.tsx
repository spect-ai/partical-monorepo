import { Namespace } from '@partical/partical-js-sdk';
import React from 'react';

export function useNamespace() {
  const getNamespace = React.useCallback(async (appId: string) => {
    if (!appId) return;
    const res = await Namespace.get(appId);
    return res;
  }, []);

  const createNamespace = React.useCallback(
    async (appName: string, schemaName: string) => {
      const res = await Namespace.create(appName, schemaName);
      return res;
    },
    []
  );

  return {
    getNamespace,
    createNamespace,
  };
}
