import { Box, Button, Heading, IconPlus, Stack, Text } from 'degen';
import { useEntity } from '@partical/react-partical';
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
  const [entities, setEntities] = useState<any>();
  const [loading, setLoading] = useState(false);

  const { getMyEntity, createEntity } = useEntity();

  useEffect(() => {
    const getEntities = async () => {
      setLoading(true);
      const res = await getMyEntity(user?.get('ethAddress'));
      console.log({ res });
      setEntities(res);
      setLoading(false);
    };
    if (user) {
      getEntities();
    }
  }, [getMyEntity, user]);

  return (
    <Box>
      {isAuthenticated ? (
        <Stack align="center">
          <Stack space="1">
            <Heading>Your DAOs</Heading>
            <Text variant="label">
              Choose and import your DAO or create a new one
            </Text>
          </Stack>
          <Box
            backgroundColor="backgroundSecondary"
            // borderRadius="2xLarge"
            height="96"
          >
            {!loading &&
              entities?.map((dao, index) => (
                <Link key={dao.id} href={`/entity/${dao.get('entityAddress')}`}>
                  <ListContainer
                    paddingY="4"
                    paddingX="8"
                    borderBottomWidth="0.375"
                    transitionDuration="500"
                  >
                    <Stack>
                      <Text weight="semiBold" size="extraLarge">
                        Dao {index}
                      </Text>
                      <Text variant="label">{dao.get('entityAddress')}</Text>
                    </Stack>
                  </ListContainer>
                </Link>
              ))}
          </Box>
          <Button
            onClick={() => {
              console.log('create');
              createEntity(user?.get('ethAddress'), 'test');
            }}
            prefix={<IconPlus />}
            center
            variant="tertiary"
          >
            Create a new DAO
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
