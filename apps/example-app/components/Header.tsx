import { Avatar, Box, Button } from 'degen';
import React from 'react';
import { useMoralis } from 'react-moralis';

export default function Header() {
  const { isAuthenticated, logout, user, authenticate } = useMoralis();

  return (
    <Box
      width="full"
      display="flex"
      justifyContent="space-between"
      padding="4"
      paddingX="8"
      height="28"
    >
      <Box />
      {isAuthenticated ? (
        <Button shape="circle" variant="transparent" onClick={() => logout()}>
          <Avatar
            src={`https://avatars.dicebear.com/api/identicon/${user.id}.svg`}
            label="avatar"
          />
        </Button>
      ) : (
        <Button onClick={() => authenticate()}>Connect</Button>
      )}
    </Box>
  );
}
