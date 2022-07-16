import React from 'react';
import { Ceramic } from '@partical/partical-js-sdk';

export default function useStream() {
  const getStream = React.useCallback(async (streamId: string) => {
    return await Ceramic.getStream(streamId);
  }, []);

  return {
    getStream,
  };
}
