import { Avatar, Box, Button, Stack } from 'degen';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useMoralis } from 'react-moralis';

export default function Header() {
  const { isAuthenticated, logout, user, authenticate } = useMoralis();
  const router = useRouter();
  const { owner } = router.query;

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
      <Stack direction="horizontal">
        <Link href={'/'}>
          <Button width="44" variant={owner ? 'transparent' : 'tertiary'}>
            Explore
          </Button>
        </Link>
        {isAuthenticated && (
          <Link href={`/dashboard/${user?.get('ethAddress')}`}>
            <Button width="44" variant={owner ? 'tertiary' : 'transparent'}>
              Dashboard
            </Button>
          </Link>
        )}
      </Stack>
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
