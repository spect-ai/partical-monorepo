import { Box, Button, Stack, Text } from 'degen';
import React from 'react';
import Modal from '.';

type Props = {
  title?: string;
  handleClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function ConfirmModal({
  title,
  handleClose,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal title="Confirm?" handleClose={handleClose} zIndex={2} size="small">
      <Box paddingX="8" paddingY="4">
        <Stack>
          <Text variant="large" weight="semiBold">
            {title}
          </Text>
          <Stack direction="horizontal">
            <Box width="full">
              <Button onClick={onCancel} variant="tertiary">
                Cancel
              </Button>
            </Box>
            <Box width="full">
              <Button onClick={onConfirm}>Yes</Button>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
