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

  const createAppData = async (
    data: T,
    entityAddress: string
    // fromSchema?: string,
    // schemaId?: string
  ) => {
    setLoading(true);
    let schemaStreamId;
    try {
      // if (fromSchema) {
      //   const schema = await Indexor.queryOneIndex('Schema', { schemaId });
      //   schemaStreamId = schema?.get('streamId');
      // }
      const app = await Indexor.queryOneIndex('Namespace', {
        appId,
      });
      const entity = await Indexor.queryIndex('EntityMapping', {
        entityAddress,
      });
      console.log({ entityAddress });
      const streamId = await Data.createData<T>(
        data,
        appId,
        [appId, 'Gitcoin'],
        entityAddress,
        entity[0].get('encryptedSymmetricKey'),
        app?.get('schemaCommit')
      );
      // const streamIds = await Schema.addToCeramic(entityAddress, appId);
      // updateAppData(streamIds[0], data, entityAddress);
      console.log({ streamId });
      return streamId;
    } catch (e) {
      setError('Error creating data');
      return false;
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
