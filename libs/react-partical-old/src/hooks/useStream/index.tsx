import { useEffect, useState } from 'react';
import { Ceramic, Data, Indexor } from '@partical/partical-js-sdk';

interface Props {
  appId: string;
  streamId: string;
  type?: 'view' | 'table';
}

export function useStream<T>({ appId, streamId, type = 'table' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamData, setStreamData] = useState<T>({} as T);
  const [metadata, setMetadata] = useState<{
    tags?: string[];
    family?: string;
  }>({} as any);
  const [entityAddress, setEntityAddress] = useState('');

  const getData = async () => {
    setLoading(true);
    try {
      if (type === 'table') {
        const { content, metadata } = await Ceramic.getStream<T>(streamId);
        setStreamData(content);
        setMetadata(metadata);
      } else {
        const content = await Data.getViewData<T>(appId, streamId);
        console.log({ content });
        setStreamData(content);
      }
    } catch (e) {
      console.log({ e });
      setError('Error getting data');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (streamId) {
      getData();
    }
  }, [streamId]);

  const canEditStream = async (userAddress: string) => {
    const stream = await Indexor.queryOneIndex('StreamIndexer', {
      streamId,
    });
    setEntityAddress(stream?.get('entityAddress'));
    const res = await Indexor.queryOneIndex('EntityMapping', {
      userAddress,
      entityAddress: stream?.get('entityAddress'),
    });
    return !!res;
  };

  return {
    loading,
    error,
    streamData,
    metadata,
    canEditStream,
    entityAddress,
    setStreamData,
    getData,
  };
}
