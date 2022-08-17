import { Box, Button, Heading, IconPencil, Stack, Text } from 'degen';
import React, { useEffect, useState } from 'react';
import { useAppData, useEntity } from '@partical/react-partical-old';
import GiveAccess from '../giveAccess';
import { useRouter } from 'next/router';
import { Accordian, Loader } from '@partical/common';
import { useMoralis } from 'react-moralis';
import DataRow from '../dataRow';
import { TileDocument } from '@ceramicnetwork/stream-tile';
// import StreamView from '../streamView';
import dynamic from 'next/dynamic';
import { useFilter, useSelect } from 'react-supabase';
import { loadDocument } from '../../services/ceramic';

const StreamView = dynamic(() => import('../streamView'), {
  ssr: false,
});

export default function EntityDashboard() {
  const router = useRouter();
  const { address } = router.query;
  const filter = useFilter((query) => query.eq('entityAddress', address), []);
  const [{ data: streams, fetching }, reexecute] = useSelect('Stream_Indexer', {
    filter,
  });
  // console.log({ streams });
  const [data, setData] = useState<any>({});

  const [access, setAccess] = useState(false);

  useEffect(() => {
    const loadStreamData = async () => {
      console.log({ streams });
      const streamData = await loadDocument(streams[0]?.streamId);
      // console.log({ streamData });
      setData(streamData);
    };
    if (streams && streams[0]) loadStreamData();
  }, [streams]);

  if (fetching) {
    return <Loader loading text="Loading.." />;
  }

  return (
    <Box paddingX="8">
      <Stack>
        <Stack direction="horizontal">
          <Heading>Dashboard</Heading>
          {access && <GiveAccess />}
        </Stack>
        <Box>
          {/* <Box borderWidth="0.5" padding="4" borderRadius="2xLarge">
            <Table
              columns={Object.keys(data[Object.keys(data)[0]]?.content)}
              rows={formatRows(data)}
            />
          </Box> */}
          {data &&
            Object.keys(data).map((app) => {
              return (
                <Box key={data[app].appId}>
                  <Accordian
                    name={<Heading>{data[app].name}</Heading>}
                    defaultOpen
                  >
                    <StreamView
                      streams={[data]}
                      access={true}
                      fetchData={reexecute}
                    />
                  </Accordian>
                </Box>
              );
            })}
        </Box>
      </Stack>
    </Box>
  );
}
