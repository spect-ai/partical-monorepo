import { Box, Button, Heading, IconCog, IconPlus, Stack } from 'degen';
import React, { useEffect } from 'react';
import { useAppData, useEntity } from '@partical/react-partical';

export default function EntityDashboard() {
  const { getMyEntity, createEntity } = useEntity();

  useEffect(() => {
    console.log('EntityDashboard');
  }, []);

  return (
    <Box paddingX="8">
      <Stack>
        <Stack direction="horizontal">
          <Heading>Dashboard</Heading>
          <Button shape="circle" size="small" variant="tertiary">
            <IconCog />
          </Button>
          <Button
            onClick={() => {
              console.log('create');
              // createAppData({
              //   name: 'test',
              // }, '');
            }}
            prefix={<IconPlus />}
            center
            variant="tertiary"
          >
            Add Description
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
