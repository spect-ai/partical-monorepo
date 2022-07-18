import { Modal } from '@partical/common';
import { useAppData } from '@partical/react-partical';
import { Box, Button, IconPencil, Input, Stack, Text } from 'degen';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

type Props = {
  content: string;
  streamId: string;
  column: string;
  fetchData: () => void;
};

export default function DataRow({
  content,
  streamId,
  column,
  fetchData,
}: Props) {
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [field, setField] = useState(content);

  const { updateAppData, loading } = useAppData({ appId: '' });

  const router = useRouter();
  const { address } = router.query;

  return (
    <>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Stack direction="horizontal" key={content}>
          <Text ellipsis>{content}</Text>
          {hover && (
            <Box cursor="pointer" onClick={() => setIsOpen(true)}>
              <Text>
                <IconPencil size="4" />
              </Text>
            </Box>
          )}
        </Stack>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title={`Edit ${column}`} handleClose={() => setIsOpen(false)}>
            <Box padding="4">
              <Stack>
                <Input
                  value={field}
                  label=""
                  onChange={(e) => setField(e.target.value)}
                />
                <Button
                  loading={loading}
                  size="small"
                  onClick={async () => {
                    await updateAppData(
                      streamId,
                      {
                        [column]: field,
                      },
                      address as string
                    );
                    await fetchData();
                    setIsOpen(false);
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
