import { Box, Button, Heading, IconPlus, Stack, Text } from 'degen';
import { useEntity, useNamespace } from '@partical/react-partical';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import styled from 'styled-components';

const ListContainer = styled(Box)`
  cursor: pointer;
  box-shadow: inset 0 0 0 0 rgb(255, 255, 255, 0.05);
  &:hover {
    box-shadow: inset 400px 0 0 0 rgb(255, 255, 255, 0.05);
  }
`;

export default function Landing() {
  const { isAuthenticated, isAuthenticating, authenticate, user } =
    useMoralis();
  const [namespaces, setNamespaces] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { createNamespace, getNamespacesByUser } = useNamespace();

  useEffect(() => {
    const getNamespaces = async () => {
      setLoading(true);
      const res = await getNamespacesByUser(user?.get('ethAddress'));
      console.log({ res });
      setNamespaces(res);
      setLoading(false);
    };
    if (user) {
      getNamespaces();
    }
  }, [getNamespacesByUser, user]);

  return (
    <Box>
      {isAuthenticated ? (
        <Stack align="center">
          <Stack space="1">
            <Heading>Your Applications</Heading>
            <Text variant="label">
              Go to an existing application or create a new one
            </Text>
          </Stack>
          <Box
            backgroundColor="backgroundSecondary"
            // borderRadius="2xLarge"
            height="96"
          >
            {!loading &&
              namespaces?.length > 0 &&
              namespaces?.map((namespace, index) => (
                <Link
                  key={namespace.id}
                  href={`/application/${namespace.get('appId')}`}
                >
                  <ListContainer
                    paddingY="4"
                    paddingX="8"
                    borderBottomWidth="0.375"
                    transitionDuration="500"
                  >
                    <Stack>
                      <Text weight="semiBold" size="extraLarge">
                        Application {index}
                      </Text>
                      <Text variant="label">{namespace.get('appId')}</Text>
                    </Stack>
                  </ListContainer>
                </Link>
              ))}
          </Box>
          <Button
            onClick={() => {
              console.log('create');
              createNamespace(user?.get('ethAddress'), 'My app');
            }}
            prefix={<IconPlus />}
            center
            variant="tertiary"
          >
            Create new App
          </Button>
        </Stack>
      ) : (
        <Stack align="center" space="8">
          <Stack space="1">
            <Heading>Welcome to Partical</Heading>
            <Text variant="label">
              Good to see you here, Connect your wallet to get started
            </Text>
          </Stack>
          <Button
            loading={isAuthenticating}
            onClick={() => {
              authenticate({
                signingMessage: 'Sign in to Partical',
              });
            }}
          >
            Connect Wallet
          </Button>
        </Stack>
      )}
    </Box>
  );
}
