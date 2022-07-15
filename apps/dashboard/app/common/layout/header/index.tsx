import { Box, Button, Tag } from 'degen';
import React from 'react';
import { useMoralis } from 'react-moralis';

export default function Header() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();

  return (
    <Box width="full" display="flex" justifyContent="space-between" padding="4">
      <Box />
      {isAuthenticated ? (
        <Box onClick={() => logout()} cursor="pointer">
          <Tag hover>{user.get('ethAddress')}</Tag>
        </Box>
      ) : (
        <Button onClick={() => authenticate()} variant="secondary">
          Connect
        </Button>
      )}
    </Box>
  );
}
