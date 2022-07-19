import Header from '../../components/Header';
import {
  Box,
  Button,
  FileInput,
  Input,
  MediaPicker,
  Stack,
  Tag,
  Text,
  Textarea,
} from 'degen';
import styled from 'styled-components';
import { useAppData, useEntity } from '@partical/react-partical';
import { useEffect, useState } from 'react';
import { useMoralis, useMoralisFile } from 'react-moralis';
import { Layout } from '@partical/common';
import CreateEntity from '../../components/CreateEntity';

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 16rem);
  overflow-y: auto;
`;

export interface GrantData {
  title: string;
  description: string;
  image: string;
  website: string;
  fundingAddress: string;
  entityAddress: string;
  streamId?: string;
}

export function CreateGrant() {
  const { loading, error, createAppData } = useAppData<GrantData>({
    appId: '3beca601-c602-453e-827b-a24f0ccff978',
  });
  const [title, settitle] = useState('Self Sovereign Database layer for DAOs');
  const [description, setdescription] = useState('');
  const [github, setgithub] = useState('https://github.com/spect-ai/tribes.v1');
  const [website, setwebsite] = useState(
    'https://gitcoin.co/grants/5971/database-layer-for-daos'
  );
  const [twitter, settwitter] = useState('joinSpect');
  const [fundAddress, setfundAddress] = useState(
    '0x6304CE63F2EBf8C0Cc76b60d34Cc52a84aBB6057'
  );
  const { isUploading, moralisFile, saveFile } = useMoralisFile();
  const { user } = useMoralis();
  const { getMyEntity, entities } = useEntity();

  useEffect(() => {
    if (user) {
      void getMyEntity(user.get('ethAddress'));
    }
  }, [user]);

  const uploadFile = async (file: File) => {
    console.log({ file });
    if (file) {
      await saveFile('image', file, { saveIPFS: true });
    }
  };

  return (
    <Layout>
      <Stack align="center">
        <ScrollContainer width="1/2">
          <Stack>
            <Stack space="2">
              <Box marginLeft="4">
                <Text weight="semiBold">Entity</Text>
              </Box>
              <Stack direction="horizontal" wrap>
                {entities?.map((entity) => (
                  <Box key={entity.id} cursor="pointer">
                    <Tag hover>{entity.get('name')}</Tag>
                  </Box>
                ))}
                <CreateEntity />
              </Stack>
            </Stack>
            <Input
              label="Title"
              placeholder="My Grant title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="Give a detailed description for your grant"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
            <MediaPicker
              label="Project Logo"
              uploaded={!!moralisFile}
              uploading={isUploading}
              onChange={uploadFile}
              maxSize={10}
            />
            {/* <Input
              label="Github URL"
              placeholder="https://github.com/mygrant"
              value={github}
              onChange={(e) => setgithub(e.target.value)}
            /> */}
            <Input
              label="Project Website"
              placeholder="https://human.fund"
              value={website}
              onChange={(e) => setwebsite(e.target.value)}
            />
            {/* <Input
              label="Project Twitter Handle"
              placeholder="mygrant"
              value={twitter}
              onChange={(e) => settwitter(e.target.value)}
            /> */}
            <Input
              label="Fund Address"
              placeholder="0xabcde..."
              value={fundAddress}
              onChange={(e) => setfundAddress(e.target.value)}
            />
          </Stack>
        </ScrollContainer>
        <Text>{error}</Text>
        <Button
          loading={loading}
          onClick={() => {
            void createAppData(
              {
                title,
                description,
                image: (moralisFile as any)._ipfs,
                website,
                fundingAddress: fundAddress,
                entityAddress: (entities?.[0] as any)?.get('entityAddress'),
              },
              (entities?.[0] as any)?.get('entityAddress')
            );
          }}
        >
          Create Grant
        </Button>
      </Stack>
    </Layout>
  );
}

export default CreateGrant;
