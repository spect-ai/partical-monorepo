import { Loader, Modal } from '@partical/common';
import { useEntity, useGnosis } from '@partical/react-partical-old';
import { Box, Button, Input, Stack, Tag, Text } from 'degen';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';

interface Props {
  getMyEntity: (userAddress: string) => void;
}

export default function CreateEntity({ getMyEntity }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { createEntity, loading } = useEntity();
  const { user } = useMoralis();
  const [name, setname] = useState('');

  const { getUserSafes, loading: loadingGnosis } = useGnosis();
  const [userSafes, setUserSafes] = useState<string[]>([]);
  const [selectedSafe, setSelectedSafe] = useState('');

  useEffect(() => {
    const getSafes = async () => {
      if (!user) return;
      const res = await getUserSafes(user?.get('ethAddress'));
      setUserSafes(res);
      console.log({ res });
    };
    if (isOpen) {
      void getSafes();
    }
  }, [isOpen]);

  return (
    <>
      <Box
        cursor="pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Tag hover tone="accent">
          Import DAO
        </Tag>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Import Your DAO" handleClose={() => setIsOpen(false)}>
            <Loader loading={loading} text="Importing your DAO please wait" />
            <Loader loading={loadingGnosis} text="Fetching your safes" />
            <Box paddingX="8" paddingBottom="8" paddingTop="2">
              <Stack>
                <Text variant="label">Select Safe</Text>
                {userSafes?.map((safe) => (
                  <Box
                    key={safe}
                    cursor="pointer"
                    onClick={() => setSelectedSafe(safe)}
                  >
                    <Tag
                      tone={selectedSafe === safe ? 'accent' : 'secondary'}
                      hover
                    >
                      {safe}
                    </Tag>
                  </Box>
                ))}
                <Input
                  label=""
                  placeholder="DAO name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await createEntity(
                      user?.get('ethAddress'),
                      name,
                      selectedSafe
                    );
                    getMyEntity(user?.get('ethAddress'));
                    setIsOpen(false);
                  }}
                >
                  Import
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
