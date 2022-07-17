import { Box, Button, Heading, Stack } from 'degen';
import { useMoralis } from 'react-moralis';
import Grant from '../components/Grant';
import Header from '../components/Header';
import { Container, Row, Col } from 'react-grid-system';
import Link from 'next/link';
import { useAppData } from '@partical/react-partical';
import { useEffect } from 'react';
import { GrantData } from './createGrant';
import { Layout } from '@partical/common';

export function Index() {
  const { loading, getAppData, appData } = useAppData<GrantData>({
    appId: 'wTao5gHcMP8wEoVROtMNZ3Iz',
  });

  const { isInitialized } = useMoralis();

  useEffect(() => {
    if (isInitialized) {
      void getAppData();
    }
  }, [isInitialized]);

  console.log({ appData });

  return (
    <Layout>
      <Box paddingX="64">
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
