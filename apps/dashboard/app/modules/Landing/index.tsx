import { Box, Button, Heading, Stack, Text } from 'degen';
import React from 'react';
import { useMoralis } from 'react-moralis';

export default function Landing() {
  const { isAuthenticated, isAuthenticating, authenticate } = useMoralis();
  return (
    <Box>
      {isAuthenticated ? (
        <Stack align="center">
          <Heading>Choose your DAO</Heading>
          <Text variant="label">Choose your DAO or create one</Text>
        </Stack>
      ) : (
        <Stack align="center" space="8">
          <Stack space="1">
            <Heading>Welcome to Partical</Heading>
            <Text variant="label">Connect your wallet to get started</Text>
          </Stack>
          <Button
            loading={isAuthenticating}
            onClick={() => {
              authenticate();
            }}
          >
            Connect Wallet
          </Button>
        </Stack>
      )}
    </Box>
  );
}
