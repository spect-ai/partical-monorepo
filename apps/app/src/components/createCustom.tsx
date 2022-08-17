import { Modal } from '@partical/common';
import {
  Box,
  Button,
  IconCheck,
  IconDocuments,
  IconPlus,
  Input,
  Stack,
} from 'degen';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useInsert } from 'react-supabase';

type props = {
  serverId: string;
};

export default function CreateCustom({ serverId }: props) {
  const [isOpen, setIsOpen] = useState(false);
  const [{ fetching }, execute] = useInsert('Custom_Indexer');
  const [loading, setLoading] = useState(false);

  const [repo, setRepo] = useState('');

  return (
    <>
      <Button
        width="64"
        prefix={<IconDocuments />}
        center
        onClick={() => setIsOpen(true)}
      >
        Create Custom
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Create Custom" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Input
                  label="Github Repo"
                  placeholder="https://github.com/xyz/your-custom-server.git"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                />
                <Button
                  variant="secondary"
                  prefix={<IconCheck />}
                  center
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const res = await execute({
                      appId: serverId,
                      githubRepo: repo,
                    });
                    console.log({ res });
                    const customRes = await fetch('/api/custom', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        serverId,
                        githubRepo: repo,
                      }),
                    });
                    console.log({ customRes });
                    setIsOpen(false);
                    setLoading(false);
                  }}
                >
                  Create
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
