import { Entity } from '@partical/partical-js-sdk';
import React from 'react';

export function useEntity() {
  const getMyEntity = React.useCallback(async (userAddress: string) => {
    if (!userAddress) return;
    const res = await Entity.getByUser(userAddress);
    return res;
  }, []);

  const createEntity = React.useCallback(async (userAddress: string) => {
    if (!userAddress) return;
    console.log('slslls');
    const res = await Entity.create(userAddress);
    return res;
  }, []);

  return {
    getMyEntity,
    createEntity,
  };
}
