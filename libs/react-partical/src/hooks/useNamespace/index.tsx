import { Namespace } from '@partical/partical-js-sdk';
import React from 'react';

export function useNamespace() {
  const getNamespacesByUser = React.useCallback(async (userAddress: string) => {
    if (!userAddress) return;
    const res = await Namespace.getByUser(userAddress);
    return res;
  }, []);

  const getNamespace = React.useCallback(async (appId: string) => {
    if (!appId) return;
    console.log({ appId });
    const res = await Namespace.get(appId);
    return res;
  }, []);

  const createNamespace = React.useCallback(async (appName: string) => {
    const res = await Namespace.create(appName);
    return res;
  }, []);

  return {
    getNamespacesByUser,
    getNamespace,
    createNamespace,
  };
}
