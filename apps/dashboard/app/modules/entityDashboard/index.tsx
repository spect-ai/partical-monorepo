import { Box, Button, Heading, IconCog, Stack } from 'degen';
import React from 'react';

export default function EntityDashboard() {
  return (
    <Box paddingX="8">
      <Stack>
        <Stack direction="horizontal">
          <Heading>Dashboard</Heading>
          <Button shape="circle" size="small" variant="tertiary">
            <IconCog />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
