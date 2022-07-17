import { Data, Indexor } from '@partical/partical-js-sdk';
import { useState } from 'react';

type Props = {
  appId: string;
};

export function useAppData<T>({ appId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appData, setAppData] = useState<T[]>({} as T[]);

  const getAppData = async () => {
    setLoading(true);
    try {
      const res: T[] = await Data.getAppData(appId);
      setAppData(res);
    } catch (e) {
      console.log({ e });
      setError('Error getting app data');
    }
    setLoading(false);
  };

  const createAppData = async (data: T, entityAddress: string) => {
    setLoading(true);
    try {
      const entity = await Indexor.queryIndex('EntityMapping', {
        entityAddress,
      });
      const streamId = await Data.createData<T>(
        data,
        appId,
        ['Grant', 'Gitcoin'],
        entityAddress,
        entity[0].get('encryptedSymmetricKey')
      );
      console.log({ streamId });
    } catch (e) {
      setError('Error creating data');
    }
    setLoading(false);
  };

  const updateAppData = async (
    streamId: string,
    data: Partial<T>,
    entityAddress: string
  ) => {
    setLoading(true);
    const entity = await Indexor.queryIndex('EntityMapping', {
      entityAddress,
    });
    const res = await Data.updateData(
      streamId,
      data,
      entityAddress,
      entity[0].get('encryptedSymmetricKey')
    );
    console.log({ res });
    setLoading(false);
    return res;
  };

  return {
    createAppData,
    getAppData,
    updateAppData,
    appData,
    loading,
    error,
  };
}
