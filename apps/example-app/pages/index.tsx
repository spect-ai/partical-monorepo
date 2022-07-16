import { Box, Button, Heading, Stack } from 'degen';
import { useMoralis } from 'react-moralis';
import Grant from '../components/Grant';
import Header from '../components/Header';
import { Container, Row, Col } from 'react-grid-system';
import Link from 'next/link';
import { useAppData } from '@partical/react-partical';
import { useEffect } from 'react';
import { GrantData } from './createGrant';

export function Index() {
  const grants = ['Grant 1', 'Grant 2', 'Grant 3', 'Grant 4', 'Grant 5'];
  const { loading, error, getAppData, appData } = useAppData<GrantData>({
    appId: 'wTao5gHcMP8wEoVROtMNZ3Iz',
  });

  useEffect(() => {
    void getAppData();
  }, []);

  console.log({ appData });

  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
      }}
    >
      <Header />
      <Heading>{loading && ' Loading .....'}</Heading>
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
                <Col key={grant.entityAddress} sm={4}>
                  <Grant grant={grant} />
                </Col>
              ))}
          </Row>
        </Container>
      </Box>
    </Box>
  );
}

export default Index;
