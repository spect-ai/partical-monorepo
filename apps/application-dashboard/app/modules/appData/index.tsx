import { Accordian } from '@partical/common';
import { useNamespace } from '@partical/react-partical';
import { Box, Button, Heading, Stack, Text } from 'degen';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';

type Props = {
  app: any;
  editable?: boolean;
};

export default function AppData({ app, editable }: Props) {
  console.log({ editable });
  const { updateApp, loading } = useNamespace();

  const [data, setdata] = useState(app.schema);
  return (
    <Box>
      <Accordian name={<Heading>{app.appName}</Heading>} defaultOpen>
        <Stack>
          <Text>{app.description}</Text>
          <Text>{app.schemaCommit}</Text>
          <ReactJson
            src={app.schema}
            theme="chalk"
            collapsed={2}
            onEdit={
              editable
                ? (e) => {
                    setdata(e.updated_src);
                  }
                : undefined
            }
            onDelete={
              editable
                ? (e) => {
                    setdata(e.updated_src);
                  }
                : undefined
            }
            onAdd={
              editable
                ? (e) => {
                    setdata(e.updated_src);
                  }
                : undefined
            }
          />
          <Button
            loading={loading}
            size="small"
            onClick={async () => {
              const res = await updateApp(data, app.appId);
              console.log({ res });
            }}
          >
            Save
          </Button>
        </Stack>
      </Accordian>
    </Box>
  );
}
