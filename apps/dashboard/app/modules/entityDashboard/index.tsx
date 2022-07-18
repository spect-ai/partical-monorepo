import { Box, Button, Heading, IconPencil, Stack, Text } from 'degen';
import React, { useEffect, useState } from 'react';
import { useEntity } from '@partical/react-partical';
import GiveAccess from '../giveAccess';
import { useRouter } from 'next/router';
import { Table } from '@partical/common';
import { useMoralis } from 'react-moralis';
import DataRow from '../dataRow';
import { TileDocument } from '@ceramicnetwork/stream-tile';

export default function EntityDashboard() {
  const { getEntityData, hasAccess, loading } = useEntity();
  const router = useRouter();
  const { address } = router.query;
  const [data, setData] = useState<{
    [key: string]: any;
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

  const formatRows = React.useCallback(
    (data: { [key: string]: TileDocument }) => {
      const rows = [];
      for (const key in data) {
        const row = [];
        for (const column in data[key].content) {
          row.push(
            <DataRow
              content={data[key].content[column]}
              streamId={key}
              column={column}
              fetchData={fetchData}
            />
          );
        }
        rows.push(row);
      }
      return rows;
    },
    []
  );

  if (loading || !Object.keys(data || {}).length) {
    return <div>Loading...</div>;
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
              formatRows(data);
            }}
          >
            a
          </Button>
          {access && <GiveAccess />}
        </Stack>
        <Box>
          <Box borderWidth="0.5" padding="4" borderRadius="2xLarge">
            <Table
              columns={Object.keys(data[Object.keys(data)[0]]?.content)}
              rows={formatRows(data)}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
