import Header from '../../components/Header';
import {
  Box,
  Button,
  FileInput,
  Input,
  MediaPicker,
  Stack,
  Text,
  Textarea,
} from 'degen';
import styled from 'styled-components';
import { useAppData } from '@partical/react-partical';
import { useState } from 'react';
import { useMoralisFile } from 'react-moralis';

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 14rem);
  overflow-y: auto;
`;

export interface GrantData {
  title: string;
  description: string;
  image: string;
  github: string;
  website: string;
  twitter: string;
  fundAddress: string;
  entityAddress: string;
  streamId?: string;
}

export function CreateGrant() {
  const { loading, error, createAppData } = useAppData<GrantData>({
    appId: 'wTao5gHcMP8wEoVROtMNZ3Iz',
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

  const uploadFile = async (file: File) => {
    console.log({ file });
    if (file) {
      await saveFile('image', file, { saveIPFS: true });
    }
  };

  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
      }}
    >
      <Header />
      <Stack align="center">
        <ScrollContainer width="1/2">
          <Stack>
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
            <Input
              label="Github URL"
              placeholder="https://github.com/mygrant"
              value={github}
              onChange={(e) => setgithub(e.target.value)}
            />
            <Input
              label="Project Website"
              placeholder="https://human.fund"
              value={website}
              onChange={(e) => setwebsite(e.target.value)}
            />
            <Input
              label="Project Twitter Handle"
              placeholder="mygrant"
              value={twitter}
              onChange={(e) => settwitter(e.target.value)}
            />
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
                github,
                website,
                twitter,
                fundAddress,
                entityAddress: '0x06EF5BC231586Ad7454AAabaa08E62Cd4652737a',
              },
              '0x06EF5BC231586Ad7454AAabaa08E62Cd4652737a'
            );
          }}
        >
          Create Grant
        </Button>
      </Stack>
    </Box>
  );
}

export default CreateGrant;
