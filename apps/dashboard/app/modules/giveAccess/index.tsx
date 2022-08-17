import { Modal } from '@partical/common';
import { useEntity } from '@partical/react-partical-old';
import { Box, Button, IconPlusSmall, Input, Stack } from 'degen';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function GiveAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');
  const { giveAccess, loading } = useEntity();

  const router = useRouter();
  const { address: entityAddress } = router.query;
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        size="small"
        prefix={<IconPlusSmall />}
        center
        variant="tertiary"
        width="56"
      >
        Give Access
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Give Access" handleClose={() => setIsOpen(false)}>
            <Box paddingX="8" paddingY="2" marginBottom="8">
              <Stack>
                <Input
                  label="Address"
                  placeholder="0x..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button
                  loading={loading}
                  onClick={async () => {
                    const res = await giveAccess(
                      address,
                      entityAddress as string
                    );
                    setIsOpen(false);
                  }}
                >
                  Give Access
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
