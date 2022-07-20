import { Namespace } from '@partical/partical-js-sdk';
import React, { useState } from 'react';

export function useNamespace() {
  const [loading, setLoading] = useState(false);
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

  const getAllNamespaces = React.useCallback(async () => {
    setLoading(true);
    const res = await Namespace.getAll();
    setLoading(false);
    return res;
  }, []);

  const createApp = React.useCallback(
    async (
      name: string,
      description: string,
      schema: any,
      userAddress: string
    ) => {
      setLoading(true);
      const res = await Namespace.createApp(
        name,
        description,
        schema,
        userAddress
      );
      setLoading(false);
      return res;
    },
    []
  );

  const createView = React.useCallback(
    async (
      name: string,
      description: string,
      resolver: any,
      userAddress: string
    ) => {
      setLoading(true);
      const res = await Namespace.createView(
        name,
        description,
        resolver,
        userAddress
      );
      setLoading(false);
      return res;
    },
    []
  );

  const updateApp = React.useCallback(async (schema: any, appId: string) => {
    setLoading(true);
    const res = await Namespace.updateApp(schema, appId);
    setLoading(false);
    return res;
  }, []);

  return {
    getNamespacesByUser,
    getNamespace,
    getAllNamespaces,
    createNamespace,
    createApp,
    createView,
    updateApp,
    loading,
  };
}
