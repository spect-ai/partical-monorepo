import Header from '../../../components/Header';
import { Box, Heading, Stack, Text } from 'degen';
import { useStream } from '@partical/react-partical';
import { useRouter } from 'next/router';
import { GrantData } from '../../createGrant';
import Link from 'next/link';
import { GrantCover } from '../../../components/Grant';
import { Col, Container, Row } from 'react-grid-system';

export function Stream() {
  const router = useRouter();
  const { stream } = router.query;
  const { streamData, loading, error, metadata } = useStream<GrantData>(
    stream as string
  );

  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
      }}
    >
      <Header />
      <Box>
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          alignItems="center"
          backgroundColor="backgroundSecondary"
        >
          <Box width="1/4">
            <GrantCover src={streamData.image} />
          </Box>
        </Box>
        <Stack align="center">
          <Box width="1/2" padding="8">
            <Stack>
              <Text>
                <Link href="/">Go back</Link>
              </Text>
              <Heading>{streamData.title}</Heading>
              <Box borderTopWidth="0.375" borderBottomWidth="0.375">
                <Container>
                  <Row>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{streamData.website}</Text>
                    </Col>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{streamData.fundAddress}</Text>
                    </Col>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{streamData.twitter}</Text>
                    </Col>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{streamData.github}</Text>
                    </Col>
                  </Row>
                </Container>
              </Box>
              <Box>
                <Heading>About</Heading>
                <Text>{streamData.description}</Text>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default Stream;
