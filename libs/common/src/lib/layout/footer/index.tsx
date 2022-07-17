import { Box, Text } from 'degen';
import React from 'react';

export default function Footer() {
  return (
    <Box
      width="full"
      display="flex"
      justifyContent="space-between"
      padding="4"
      paddingX="8"
    >
      <Box />
      <Text font="mono">
        Made with{' '}
        <span role="img" aria-label="Heart">
          ❤️
        </span>{' '}
        by Spect Labs
      </Text>
    </Box>
  );
}
