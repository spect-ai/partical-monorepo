import { Box, Heading, Stack, Text } from 'degen';
import { useStream } from '@partical/react-partical';
import { useRouter } from 'next/router';
import { GrantData } from '../../createGrant';
import Link from 'next/link';
import { GrantImage } from '../../../components/Grant';
import { Col, Container, Row } from 'react-grid-system';
import { smartTrim } from '../../../utils/utils';
import { Layout, Loader } from '@partical/common';
import styled from 'styled-components';
import UpdateGrant from '../../../components/UpdateGrant';

const GrantCover = styled(GrantImage)`
  height: 250px;
`;

export function Stream() {
  const router = useRouter();
  const { stream } = router.query;
  const { streamData, loading, getData } = useStream<GrantData>({
    appId: '5d3a207d-f4aa-4dc8-a43a-c8d7c4626ab1',
    streamId: stream as string,
    type: 'view',
  });

  console.log({ streamData });
  return (
    <Layout>
      {loading && <Loader loading text="Loading..." />}
      <Box>
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          alignItems="center"
          backgroundColor="backgroundSecondary"
        >
          <Box width="56">
            <GrantCover src={streamData.image} />
          </Box>
        </Box>
        <Stack align="center">
          <Box width="2/3" padding="8">
            <Stack>
              <Text>
                <Link href="/">Go back</Link>
              </Text>
              <Stack direction="horizontal">
                <Heading>{streamData.title}</Heading>
                <UpdateGrant
                  grant={streamData}
                  streamId={stream as string}
                  getData={getData}
                />
              </Stack>
              <Box borderTopWidth="0.375" borderBottomWidth="0.375">
                <Container>
                  <Row>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{streamData.website}</Text>
                    </Col>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{smartTrim(streamData.fundingAddress, 12)}</Text>
                    </Col>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{'@joinSpect'}</Text>
                    </Col>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{'https://github.com/spect-ai/tribes.v1'}</Text>
                    </Col>
                  </Row>
                </Container>
              </Box>
              <Box>
                <Heading>Description</Heading>
                <Text>{streamData.description}</Text>
              </Box>
              <Box>
                <Heading>About DAO</Heading>
                <Stack>
                  <Text variant="label">Name</Text>
                  <Text>{streamData.daoName}</Text>
                  <Text variant="label">About</Text>
                  <Text>{streamData.daoAbout}</Text>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
}

export default Stream;
