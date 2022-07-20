import { Gnosis } from '@partical/partical-js-sdk';
import React, { useState } from 'react';

export function useGnosis() {
  const [loading, setLoading] = useState(false);

  const getUserSafes = React.useCallback(async (userAddress: string) => {
    setLoading(true);
    const res = await Gnosis.getUserSafes(userAddress);
    setLoading(false);
    return res.safes;
  }, []);

  return {
    getUserSafes,
    loading,
  };
}
