import React, { useEffect, useState } from 'react';
import { Ceramic } from '@partical/partical-js-sdk';

export function useStream<T>(streamId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamData, setStreamData] = useState<T>({} as T);
  const [metadata, setMetadata] = useState<{
    tags?: string[];
    family?: string;
  }>({} as any);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        await Ceramic.initialize('http://localhost:7007');
        const { content, metadata } = await Ceramic.getStream<T>(streamId);
        setStreamData(content);
        setMetadata(metadata);
      } catch (e) {
        console.log({ e });
        setError('Error getting data');
      }
      setLoading(false);
    };
    if (streamId) {
      getData();
    }
  }, [streamId]);

  return {
    loading,
    error,
    streamData,
    metadata,
  };
}
