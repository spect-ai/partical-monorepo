/* eslint-disable @next/next/no-img-element */
import { Layout } from '@partical/common';
import { createClient } from '@supabase/supabase-js';
import {
  Box,
  Button,
  Heading,
  IconPlus,
  IconPlusSmall,
  Stack,
  Text,
} from 'degen';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelect } from 'react-supabase';
import styled from 'styled-components';
import CreateApp from '../src/components/createApp';
import CreateCustom from '../src/components/createCustom';
import CreateSchema from '../src/components/createSchema';
import ViewApps from '../src/components/viewApps';

const StyledPage = styled.div`
  .page {
  }
`;

const supabase = createClient(
  'https://pdklnrniahkmzattdpzx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBka2xucm5pYWhrbXphdHRkcHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc3Mjc4NTQsImV4cCI6MTk3MzMwMzg1NH0.PgP5Gy2swmstoZlLBjCgfbwLRQIfxJsH8EET42KTLQg'
);

export function ServerPage() {
  const [{ data }, reexecute] = useSelect('Custom_Indexer');
  const router = useRouter();
  const { serverId } = router.query;

  const [schemas, setSchemas] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const getSchemas = React.useCallback(async () => {
    const res = await fetch(
      `https://shared.partical.xyz/server${serverId}/schema`
    );
    const data = await res.json();
    setSchemas(['user', ...data.map((d: { schemaName: any }) => d.schemaName)]);
  }, [serverId]);

  useEffect(() => {
    if (serverId) {
      getSchemas();
    }
  }, [serverId, getSchemas]);

  useEffect(() => {
    const mySubscription = supabase
      .from(`Custom_Indexer`)
      .on('UPDATE', (payload) => {
        console.log({ payload });
        setIsDeploying(payload.new.isDeploying);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  return (
    <Layout header={<Box />}>
      <Box padding="8">
        <Stack direction="horizontal" align="center" justify="center">
          <img src="/logo-transparentbg.png" alt="me" height="72" />
        </Stack>
      </Box>
      <Box padding="8">
        <Stack space="8">
          <Stack>
            <Stack direction="horizontal">
              <Text variant="label">Server Url</Text>
              <Text>{`https://shared.partical.xyz/server${serverId}`}</Text>
            </Stack>
            <Heading>Schemas</Heading>
            <Stack space="2">
              {schemas?.map((schema) => (
                <Box key={schema}>
                  <Text size="extraLarge" weight="semiBold">
                    {schema}
                  </Text>
                </Box>
              ))}
            </Stack>
            <CreateSchema
              serverURL={`https://shared.partical.xyz/server${serverId}`}
              fetchSchema={getSchemas}
            />
          </Stack>
          <Stack>
            <Heading>Custom Server</Heading>
            <Stack space="2">
              {data?.map((custom) => (
                <Box key={custom.id}>
                  <Text size="extraLarge" weight="semiBold">
                    {custom.githubRepo}
                  </Text>
                </Box>
              ))}
              {isDeploying && (
                <Box>
                  <Stack direction="horizontal" align="center">
                    <Text variant="label">Deploying</Text>
                    <Box marginRight="4" />
                    <div className="dot-falling"></div>
                  </Stack>
                </Box>
              )}
            </Stack>
            {data?.length === 0 && (
              <CreateCustom serverId={serverId as string} />
            )}
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}

export default ServerPage;
