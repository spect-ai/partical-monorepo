import { Box, Button, Stack } from 'degen';
import { useMoralis } from 'react-moralis';
import Grant from '../components/Grant';
import { Container, Row, Col } from 'react-grid-system';
import Link from 'next/link';
import { useAppData } from '@partical/react-partical-old';
import { useEffect } from 'react';
import { GrantData } from './createGrant';
import { Layout, Loader } from '@partical/common';

export function Index() {
  const { loading, getAppData, appData } = useAppData<GrantData>({
    appId: '0be7a9c7-c6d2-44f3-8fed-1766ed3600fb',
  });

  const { isInitialized } = useMoralis();

  useEffect(() => {
    if (isInitialized) {
      void getAppData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  console.log({ appData });

  return (
    <Layout>
      <Box paddingX="64">
        <Loader loading={loading} text="Fetching" />
        <Box padding="4">
          <Stack direction="horizontal" justify="space-between">
            <Box />
            <Link href="/createGrant">
              <Button size="small" variant="secondary">
                Create Grant
              </Button>
            </Link>
          </Stack>
        </Box>
        <Container>
          <Row>
            {appData.map &&
              appData?.map((grant) => (
                <Col
                  key={grant.entityAddress}
                  sm={4}
                  style={{ marginBottom: '1rem' }}
                >
                  <Grant grant={grant} />
                </Col>
              ))}
          </Row>
        </Container>
      </Box>
    </Layout>
  );
}

export default Index;
