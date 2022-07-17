import { Loader, Modal } from '@partical/common';
import { useEntity } from '@partical/react-partical';
import { Box, Button, Input, Stack, Tag } from 'degen';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { useMoralis } from 'react-moralis';

export default function CreateEntity() {
  const [isOpen, setIsOpen] = useState(false);
  const { createEntity, loading } = useEntity();
  const { user } = useMoralis();
  const [name, setname] = useState('');
  return (
    <>
      <Box
        cursor="pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Tag hover tone="accent">
          Create Entity
        </Tag>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Create Your DAO" handleClose={() => setIsOpen(false)}>
            <Loader
              loading={loading}
              text="Creating your DAO, this might take a while..."
            />
            <Box padding="8">
              <Stack>
                <Input
                  label=""
                  placeholder="DAO name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={() => createEntity(user?.get('ethAddress'), name)}
                >
                  Create DAO
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
