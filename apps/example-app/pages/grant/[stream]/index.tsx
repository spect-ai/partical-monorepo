import { Box, Button, Heading, Stack, Text } from 'degen';
import { useStream } from '@partical/react-partical';
import { useRouter } from 'next/router';
import { GrantData } from '../../createGrant';
import Link from 'next/link';
import { GrantImage } from '../../../components/Grant';
import { Col, Container, Row } from 'react-grid-system';
import { smartTrim } from '../../../utils/utils';
import { Layout } from '@partical/common';
import styled from 'styled-components';
import { useMoralis } from 'react-moralis';
import { useEffect, useState } from 'react';

const GrantCover = styled(GrantImage)`
  height: 250px;
`;

export function Stream() {
  const router = useRouter();
  const { stream } = router.query;
  const { streamData, canEditStream } = useStream<GrantData>(stream as string);
  const { user } = useMoralis();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchCanEdit = async () => {
      const canEdit = await canEditStream(user?.get('ethAddress'));
      setCanEdit(canEdit);
    };
    if (user) {
      fetchCanEdit();
    }
  }, [canEditStream, user]);

  return (
    <Layout>
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
                {canEdit && (
                  <Button size="small" variant="secondary">
                    Edit Grant
                  </Button>
                )}
              </Stack>
              <Box borderTopWidth="0.375" borderBottomWidth="0.375">
                <Container>
                  <Row>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{streamData.website}</Text>
                    </Col>
                    <Col xs={6} style={{ padding: '1rem' }}>
                      <Text>{smartTrim(streamData.fundAddress, 12)}</Text>
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
    </Layout>
  );
}

export default Stream;
