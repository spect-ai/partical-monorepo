import { Entity } from '@partical/partical-js-sdk';
import React from 'react';

export function useEntity() {
  const getMyEntity = React.useCallback(async (userAddress: string) => {
    if (!userAddress) return;
    const res = await Entity.getByUser(userAddress);
    return res;
  }, []);

  return {
    getMyEntity,
  };
}
