import { Entity } from '@partical/partical-js-sdk';
import React, { useState } from 'react';

export function useEntity() {
  const [entities, setEntities] = useState<any[]>();
  const [loading, setloading] = useState(false);

  const getMyEntity = React.useCallback(async (userAddress: string) => {
    if (!userAddress) return;
    setloading(true);
    const res = await Entity.getByUser(userAddress);
    setEntities(res);
    setloading(false);
    return res;
  }, []);

  const createEntity = React.useCallback(
    async (userAddress: string, name: string) => {
      if (!userAddress) return;
      setloading(true);
      const res = await Entity.create(userAddress, name);
      setloading(false);
      return res;
    },
    []
  );

  return {
    getMyEntity,
    createEntity,
    entities,
    loading,
  };
}
