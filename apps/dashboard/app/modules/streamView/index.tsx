import { TileDocument } from '@ceramicnetwork/stream-tile';
import { Loader } from '@partical/common';
import { Data } from '@partical/partical-js-sdk';
import { useAppData } from '@partical/react-partical-old';
import { Box } from 'degen';
import { useRouter } from 'next/router';
import React from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import { useFilter, useSelect } from 'react-supabase';

type Props = {
  streams: TileDocument[];
  access: boolean;
  fetchData: () => void;
};

export default function StreamView({ streams, access, fetchData }: Props) {
  const { updateAppData, loading } = useAppData({ appId: '' });
  const filter = useFilter((query) => query.eq('entityAddress', address), []);
  const [{ data: entity, fetching }, reexecute] = useSelect('Entity_Indexer', {
    filter,
  });
  console.log({ entity });
  const router = useRouter();
  const { address } = router.query;
  const onEdit = async (e: InteractionProps, streamId: string) => {
    const res = await Data.updateData(
      streamId,
      e.updated_src,
      address as string,
      entity[0].encryptedSymmetricKey
    );
    console.log({ res });
    await fetchData();
  };

  return (
    <Box>
      <Loader loading={loading} text="Updating stream" />
      {streams.map((stream) => (
        <ReactJson
          src={stream.content}
          name={stream.id.toString()}
          theme="chalk"
          key={stream.id.toString()}
          onEdit={
            access
              ? (e) => {
                  onEdit(e, stream.id.toString());
                }
              : undefined
          }
          collapsed={2}
          collapseStringsAfterLength={111}
          indentWidth={8}
        />
      ))}
    </Box>
  );
}
