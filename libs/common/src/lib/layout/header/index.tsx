import { Avatar, Box, Button, Tag, Text } from 'degen';
import React from 'react';
import { useMoralis } from 'react-moralis';

export default function Header() {
  const { authenticate, isAuthenticated, user, logout, isAuthenticating } =
    useMoralis();

  return (
    <Box
      width="full"
      display="flex"
      justifyContent="space-between"
      paddingTop="4"
      paddingBottom="4"
      paddingX="8"
    >
      <Box></Box>
      {!isAuthenticated ? (
        // <Box onClick={() => logout()} cursor="pointer">
        //   <Tag hover>{user.get('ethAddress')}</Tag>
        // </Box>
        <Button
          size="small"
          loading={isAuthenticating}
          onClick={() => authenticate()}
        >
          Connect
        </Button>
      ) : (
        <Button
          shape="circle"
          variant="transparent"
          onClick={() => logout()}
          size="small"
        >
          <Avatar
            src={`https://avatars.dicebear.com/api/identicon/${user?.id}.svg`}
            label="avatar"
          />
        </Button>
      )}
    </Box>
  );
}
