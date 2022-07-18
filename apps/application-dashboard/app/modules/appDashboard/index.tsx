import {
  Box,
  Button,
  Heading,
  IconCog,
  IconPlus,
  IconPlusSmall,
  Stack,
} from 'degen';
import React, { useEffect } from 'react';
import { useSchema, useNamespace } from '@partical/react-partical';

export default function EntityDashboard() {
  const { getMyEntity, createEntity } = useNamespace();

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

          <GiveAccess />
          <Button
            onClick={() => {
              console.log('create');
              // createAppData({
              //   name: 'test',
              // }, '');
            }}
            size="small"
            prefix={<IconPlusSmall />}
            center
            variant="transparent"
            width="56"
          >
            Add Description
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}