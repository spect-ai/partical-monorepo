import { Data, Indexor } from '@partical/partical-js-sdk';
import { useEffect, useState } from 'react';

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
      console.log(entity[0].get('encryptedSymmetricKey'));
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

  return {
    createAppData,
    getAppData,
    appData,
    loading,
    error,
  };
}
