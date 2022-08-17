import { Accordian } from '@partical/common';
import { useNamespace } from '@partical/react-partical-old';
import { Box, Button, Heading, Stack, Tag, Text } from 'degen';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { toast } from 'react-toastify';

type Props = {
  app: any;
  editable?: boolean;
};

export default function AppData({ app, editable }: Props) {
  console.log({ app });
  const { updateApp, loading } = useNamespace();

  const [data, setdata] = useState(app.schema);
  return (
    <Box>
      <Accordian name={<Heading>{app.appName}</Heading>} defaultOpen>
        <Stack>
          <Text variant="label">{app.description}</Text>
          <Box
            cursor="pointer"
            onClick={() => {
              navigator.clipboard.writeText(app.appId);
              toast('Copied to clipboard', {
                theme: 'dark',
              });
            }}
          >
            <Tag hover>{app.appId}</Tag>
          </Box>
          <ReactJson
            src={app.schema || app.resolver}
            theme="chalk"
            collapsed={app.isView ? 3 : 2}
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
          <Box margin="2">
            <Stack direction="horizontal">
              {editable && (
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
              )}
            </Stack>
          </Box>
        </Stack>
      </Accordian>
    </Box>
  );
}
