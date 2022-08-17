import { Modal } from '@partical/common';
import { Box, Button, IconCheck, IconPlus, Input, Stack } from 'degen';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useInsert } from 'react-supabase';

type props = {
  refetch: () => void;
};

export default function CreateApp({ refetch }: props) {
  const [isOpen, setIsOpen] = useState(false);
  const [{ fetching }, execute] = useInsert('App_Indexer');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');

  return (
    <>
      <Button
        width="64"
        prefix={<IconPlus />}
        center
        onClick={() => setIsOpen(true)}
      >
        Create App
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Create App" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Input
                  label="Name"
                  placeholder="My First decentralized app on ceramic"
                  name={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button
                  variant="secondary"
                  prefix={<IconCheck />}
                  center
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const serverRes = await fetch('/api/server', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
                    if (serverRes.ok) {
                      const res = await execute({
                        serverId: '1',
                        serverURL: 'https://shared.partical.xyz/server1',
                        name,
                        owner: '0x6304CE63F2EBf8C0Cc76b60d34Cc52a84aBB6057',
                      });
                      console.log({ res });
                      refetch();
                      setIsOpen(false);
                      setLoading(false);
                    } else {
                      console.log({ serverRes });

                      setLoading(false);
                    }
                  }}
                >
                  Create App
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
