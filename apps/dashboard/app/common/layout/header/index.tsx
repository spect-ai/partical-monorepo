import { Avatar, Box, Button, Tag, Text } from 'degen';
import React from 'react';
import { useMoralis } from 'react-moralis';

export default function Header() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();

  return (
    <Box
      width="full"
      display="flex"
      justifyContent="space-between"
      padding="4"
      paddingX="8"
      height="28"
    >
      <Box></Box>
      {isAuthenticated && (
        // <Box onClick={() => logout()} cursor="pointer">
        //   <Tag hover>{user.get('ethAddress')}</Tag>
        // </Box>
        <Button shape="circle" variant="transparent" onClick={() => logout()}>
          <Avatar
            src={`https://avatars.dicebear.com/api/identicon/${user.id}.svg`}
            label="avatar"
          />
        </Button>
      )}
    </Box>
  );
}
