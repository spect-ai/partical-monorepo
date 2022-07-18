import {
  Box,
  Button,
  Heading,
  IconCog,
  IconPlus,
  IconPlusSmall,
  Stack,
  Text,
} from 'degen';
import React, { useEffect, useState } from 'react';
import { useSchema, useNamespace } from '@partical/react-partical';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';

const ListContainer = styled(Box)`
  cursor: pointer;
  box-shadow: inset 0 0 0 0 rgb(255, 255, 255, 0.05);
  &:hover {
    box-shadow: inset 400px 0 0 0 rgb(255, 255, 255, 0.05);
  }
`;
export default function AppDashboard() {
  const { getNamespace } = useNamespace();
  const { createSchema, getSchemaByApp } = useSchema();
  const router = useRouter();
  const { appId } = router.query;
  const [namespace, setNamespace] = useState({});
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AppDashboard');
    const getSchemas = async () => {
      setLoading(true);
      const namespace = getNamespace(appId as string);
      const schemas = await getSchemaByApp(appId as string);
      setNamespace(namespace);
      setSchemas(schemas);
      setLoading(false);
    };
    if (appId) {
      getSchemas();
    }
  }, [appId, getNamespace]);

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
              createSchema(
                'http://json-schema.org/draft-07/schema#',
                'MySchema',
                'object',
                {
                  name: {
                    type: 'string',
                    maxLength: 150,
                  },
                },
                appId as string,
                ['name']
              );
            }}
            size="small"
            prefix={<IconPlusSmall />}
            center
            variant="transparent"
            width="56"
          >
            Create schema
          </Button>
        </Stack>
      </Stack>
      <Box
        backgroundColor="backgroundSecondary"
        // borderRadius="2xLarge"
        height="96"
        marginTop="8"
      >
        {!loading &&
          schemas?.length > 0 &&
          schemas?.map((schema, index) => (
            <Link key={schema.id} href={`/application/schema/`}>
              <ListContainer
                paddingY="4"
                paddingX="8"
                borderBottomWidth="0.375"
                transitionDuration="500"
              >
                <Stack>
                  <Text weight="semiBold" size="extraLarge">
                    Schema {index}
                  </Text>
                  <Text variant="label">{schema?.name}</Text>
                </Stack>
              </ListContainer>
            </Link>
          ))}
      </Box>
    </Box>
  );
}
