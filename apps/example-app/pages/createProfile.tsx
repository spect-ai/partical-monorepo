import { Box, Button, Input, Stack, Tag, Text, Textarea } from 'degen';
import styled from 'styled-components';
import { useAppData, useEntity } from '@partical/react-partical-old';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Layout } from '@partical/common';
import CreateEntity from '../components/CreateEntity';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 16rem);
  overflow-y: auto;
`;

export interface DAOProfile {
  entityAddress: string;
  name: string;
  about: string;
}

export function CreateProfile() {
  const { loading, error, createAppData } = useAppData<DAOProfile>({
    appId: '8d81462f-816c-404c-9efa-51c6e2a80fa8',
  });
  const [title, settitle] = useState('');
  const [description, setdescription] = useState('');
  const { user } = useMoralis();
  const { getMyEntity, entities } = useEntity();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      void getMyEntity(user.get('ethAddress'));
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>DAO Profile</title>
      </Head>
      <Layout>
        <Stack align="center">
          <ScrollContainer width="1/2">
            <Stack>
              <Stack space="2">
                <Box marginLeft="4">
                  <Text weight="semiBold">DAO</Text>
                </Box>
                <Stack direction="horizontal" wrap>
                  {entities?.map((entity) => (
                    <Box key={entity.id} cursor="pointer">
                      <Tag hover>{entity.get('name')}</Tag>
                    </Box>
                  ))}
                  <CreateEntity getMyEntity={getMyEntity} />
                </Stack>
              </Stack>
              <Input
                label="DAO Name"
                placeholder="DAO Name"
                value={title}
                onChange={(e) => settitle(e.target.value)}
              />
              <Textarea
                label="About DAO"
                placeholder="Talk about your DAO"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </Stack>
          </ScrollContainer>
          <Text>{error}</Text>
          <Button
            loading={loading}
            onClick={async () => {
              const streamId = await createAppData(
                {
                  entityAddress: (entities?.[0] as any)?.get('entityAddress'),
                  name: title,
                  about: description,
                },
                (entities?.[0] as any)?.get('entityAddress')
              );
              console.log({ streamId });
            }}
          >
            Create Profile
          </Button>
        </Stack>
      </Layout>
    </>
  );
}

export default CreateProfile;
