import { Accordian } from '@partical/common';
import { Box, Heading, Stack, Text } from 'degen';
import React from 'react';
import ReactJson from 'react-json-view';

type Props = {
  app: any;
};

export default function AppData({ app }: Props) {
  return (
    <Box>
      <Accordian name={<Heading>{app.appName}</Heading>} defaultOpen>
        <Stack>
          <Text>{app.description}</Text>
          <Text>{app.schemaCommit}</Text>
          <ReactJson src={app.schema} theme="chalk" collapsed={2} />
        </Stack>
      </Accordian>
    </Box>
  );
}
