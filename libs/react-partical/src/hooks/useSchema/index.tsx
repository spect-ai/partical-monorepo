import React from 'react';
import { useQuery } from 'wagmi';
import { useParticalClient } from '../../provider';

type Props = {
  schemaId: string;
};

export default function useSchema({ schemaId }: Props) {
  const { particalHost } = useParticalClient();

  const { data: schema } = useQuery(
    ['schema', schemaId],
    () =>
      fetch(`${particalHost}/schema/${schemaId}`, {
        credentials: 'include',
      }).then(async (res) => await res.json()),
    {
      enabled: !!schemaId && !!particalHost,
    }
  );

  const createData = async (data: any) => {
    const res = await fetch(`${particalHost}/indexer/${schemaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creating data');
    return await res.json();
  };

  const getDataById = async (id: string) => {
    const res = await fetch(`${particalHost}/indexer/${schemaId}/${id}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Error getting data');
    return await res.json();
  };

  const updateDataById = async (id: string, data: any) => {
    const res = await fetch(`${particalHost}/indexer/${schemaId}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error updating data');
    return await res.json();
  };

  const getAllData = async () => {
    const res = await fetch(`${particalHost}/indexer/${schemaId}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Error getting data');
    return await res.json();
  };

  return {
    schema,
    createData,
    getDataById,
    updateDataById,
    getAllData,
  };
}
