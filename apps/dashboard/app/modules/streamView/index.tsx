import { TileDocument } from '@ceramicnetwork/stream-tile';
import { Loader } from '@partical/common';
import { useAppData } from '@partical/react-partical';
import { Box } from 'degen';
import { useRouter } from 'next/router';
import React from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';

type Props = {
  streams: TileDocument[];
  access: boolean;
  fetchData: () => void;
};

export default function StreamView({ streams, access, fetchData }: Props) {
  const { updateAppData, loading } = useAppData({ appId: '' });
  const router = useRouter();
  const { address } = router.query;
  const onEdit = async (e: InteractionProps, streamId: string) => {
    console.log({ e, streamId });
    await updateAppData(streamId, e.updated_src, address as string);
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
