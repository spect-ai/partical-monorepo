import { Box, Button, Heading, IconPencil, Stack, Text } from 'degen';
import React, { useEffect, useState } from 'react';
import { useAppData, useEntity } from '@partical/react-partical';
import GiveAccess from '../giveAccess';
import { useRouter } from 'next/router';
import { Accordian, Loader } from '@partical/common';
import { useMoralis } from 'react-moralis';
import DataRow from '../dataRow';
import { TileDocument } from '@ceramicnetwork/stream-tile';
// import StreamView from '../streamView';
import dynamic from 'next/dynamic';

const StreamView = dynamic(() => import('../streamView'), {
  ssr: false,
});

export default function EntityDashboard() {
  const { getEntityData, hasAccess, loading } = useEntity();
  const router = useRouter();
  const { address } = router.query;
  const [data, setData] = useState<{
    [key: string]: {
      appId: string;
      name: string;
      schemaName: string;
      streams: any[];
    };
  }>({});

  const [access, setAccess] = useState(false);
  const { user, isAuthenticated } = useMoralis();

  const fetchData = async () => {
    const res = await getEntityData(address as string);
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, [address]);

  useEffect(() => {
    const fetchAccess = async () => {
      const res = await hasAccess(user.get('ethAddress'), address as string);
      setAccess(res);
    };
    if (user) {
      fetchAccess();
    }
  }, [address, isAuthenticated]);

  if (loading) {
    return <Loader loading text="Loading.." />;
  }

  return (
    <Box paddingX="8">
      <Stack>
        <Stack direction="horizontal">
          <Heading>Dashboard</Heading>
          <Button
            shape="circle"
            size="small"
            variant="tertiary"
            onClick={() => {
              console.log('test');
            }}
          ></Button>
          {access && <GiveAccess />}
        </Stack>
        <Box>
          {/* <Box borderWidth="0.5" padding="4" borderRadius="2xLarge">
            <Table
              columns={Object.keys(data[Object.keys(data)[0]]?.content)}
              rows={formatRows(data)}
            />
          </Box> */}
          {Object.keys(data).map((app) => {
            return (
              <Box key={data[app].appId}>
                <Accordian
                  name={<Heading>{data[app].name}</Heading>}
                  defaultOpen
                >
                  <StreamView
                    streams={data[app].streams}
                    access={access}
                    fetchData={fetchData}
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
