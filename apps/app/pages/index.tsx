/* eslint-disable @next/next/no-img-element */
import { Layout } from '@partical/common';
import { Box, Button, Heading, IconPlus, Stack } from 'degen';
import Image from 'next/image';
import { useEffect } from 'react';
import { useSelect } from 'react-supabase';
import styled from 'styled-components';
import CreateApp from '../src/components/createApp';
import ViewApps from '../src/components/viewApps';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  const [{ data }, reexecute] = useSelect('App_Indexer');
  return (
    <Layout header={<Box />}>
      <Box padding="8">
        <Stack direction="horizontal" align="center" justify="center">
          <img src="/logo-transparentbg.png" alt="me" height="72" />
        </Stack>
      </Box>
      <Box padding="8">
        <Stack>
          <CreateApp refetch={reexecute} />
          <ViewApps data={data} />
        </Stack>
      </Box>
    </Layout>
  );
}

export default Index;
