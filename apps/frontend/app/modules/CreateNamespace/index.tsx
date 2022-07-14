import { Box, Button, Heading, Input, Stack, Text } from 'degen';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import React, { useState } from 'react';
import Modal from '../../common/components/Modal';

import { Namespace } from '@partical/partical-js-sdk';

export default function CreateNamespace() {
  const [appName, setAppName] = useState('');
  const [schemaName, setSchemaName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box padding="8">
      <Link href="/">Go back</Link>
      <Heading>Create your Namespace</Heading>
      <Box marginTop="8" width="1/2">
        <Stack>
          <Input
            label="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <Input
            label="Schema Name"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={async () => {
              const sdk = new Namespace.Namespace();
              const { key } = await sdk.createNamespace(appName, schemaName);
              console.log({ key });
              setApiKey(key);
              setIsOpen(true);
              // AYWKcYZ64wxvECM8IfDmdU6nj6zVZ+Jbe4C2Ue3aL+w=
            }}
          >
            Create Namespace
          </Button>
        </Stack>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Success" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Text variant="extraLarge">Copy your apikey</Text>
                <Text>{apiKey}</Text>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}
