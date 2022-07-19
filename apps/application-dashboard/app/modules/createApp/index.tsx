import { useNamespace } from '@partical/react-partical';
import {
  Box,
  Button,
  Heading,
  IconClose,
  IconPlus,
  Input,
  Stack,
  Text,
} from 'degen';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { useMoralis } from 'react-moralis';
import styled from 'styled-components';
import { defaultSchema } from './defaultSchema';

const Container = styled(Box)`
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
`;

export default function CreateApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [schema, setSchema] = useState<any>(defaultSchema);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { createApp, loading } = useNamespace();

  const { user } = useMoralis();

  const router = useRouter();
  return (
    <>
      <Button
        prefix={<IconPlus />}
        size="small"
        onClick={() => setIsOpen(true)}
      >
        Create App
      </Button>
      <Container
        width={isOpen ? '168' : '0'}
        opacity={isOpen ? '100' : '0'}
        overflow="auto"
      >
        <Box padding="8" borderBottomWidth="0.375">
          <Stack direction="horizontal" justify="space-between">
            <Heading>Create App</Heading>
            <Button
              shape="circle"
              size="small"
              variant="transparent"
              onClick={() => setIsOpen(false)}
            >
              <IconClose />
            </Button>
          </Stack>
        </Box>
        <Box
          borderBottomWidth="0.375"
          paddingX="8"
          paddingTop="6"
          paddingBottom="8"
        >
          <Stack>
            <Text weight="semiBold" size="extraLarge">
              App Metadata
            </Text>
            <Input
              placeholder="Gitcoin grants"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Create grants for your DAO"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </Box>
        <Box
          borderBottomWidth="0.375"
          paddingX="8"
          paddingTop="6"
          paddingBottom="8"
        >
          <Stack>
            <Text weight="semiBold" size="extraLarge">
              Schema
            </Text>
            <Stack>
              <ReactJson
                enableClipboard
                theme="chalk"
                name={'App'}
                src={schema}
                onEdit={(e) => {
                  setSchema(e.updated_src);
                }}
                onAdd={(e) => {
                  setSchema(e.updated_src);
                }}
                onDelete={(e) => {
                  setSchema(e.updated_src);
                }}
              />
            </Stack>
          </Stack>
        </Box>
        <Box padding="8">
          <Button
            width="1/2"
            size="small"
            loading={loading}
            onClick={async () => {
              await createApp(
                name,
                description,
                schema,
                user?.get('ethAddress')
              );
              router.push(`/dashboard/${user?.get('ethAddress')}`);
            }}
          >
            Save
          </Button>
        </Box>
      </Container>
    </>
  );
}
