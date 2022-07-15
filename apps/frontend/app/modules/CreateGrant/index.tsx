import { Entity, Stream } from '@partical/partical-js-sdk';
import { Box, Button, Heading, Input, Spinner, Stack, Tag, Text } from 'degen';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import Modal from '../../common/components/Modal';

export default function CreateGrant() {
  const [appName, setAppName] = useState('');
  const [schemaName, setSchemaName] = useState('');
  const [grantAddress, setGrantAddress] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [entityAddress, setEntityAddress] = useState('');
  const [entity, setEntity] = useState<any>();
  const [loading, setLoading] = useState(false);

  const { user } = useMoralis();

  useEffect(() => {
    const getMyEntity = async () => {
      const data = await Entity.Entity.getByUser(user.get('ethAddress'));
      console.log({ data });
      setEntityAddress(data.get('entityAddress'));
      setEntity(data);
    };
    if (user?.get('ethAddress')) {
      getMyEntity();
    }
  }, [user]);

  return (
    <Box padding="8">
      <Link href="/">Go back</Link>
      <Heading>Create your Grant</Heading>
      <Box marginTop="8" width="1/2">
        <Stack>
          <Input
            label="Grant name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <Input
            label="Grant description"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
          />
          <Input
            label="Fund Address"
            value={grantAddress}
            onChange={(e) => setGrantAddress(e.target.value)}
          />
          <Box marginLeft="4">
            <Text weight="semiBold">Your Entity</Text>
          </Box>
          <Tag>{entityAddress}</Tag>
          <Button
            variant="secondary"
            loading={loading}
            onClick={async () => {
              const streamSDK = new Stream.StreamData({
                apiKey: 'AYWKcYZ64wxvECM8IfDmdU6nj6zVZ+Jbe4C2Ue3aL+w=',
              });
              setLoading(true);
              const res = await streamSDK.createStreamData(
                entity.get('entityAddress'),
                entity.get('streamId'),
                entity.get('encryptedSymmetricKey'),
                {
                  grantName: appName,
                  grantDescription: schemaName,
                  grantAddress: grantAddress,
                }
              );
              setLoading(false);
            }}
          >
            Create grant
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
