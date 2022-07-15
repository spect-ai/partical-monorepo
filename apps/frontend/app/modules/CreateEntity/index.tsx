import { Entity } from '@partical/partical-js-sdk';
import { Box, Button, Stack } from 'degen';
import Link from 'next/link';
import React, { useState } from 'react';
import { useMoralis } from 'react-moralis';

export default function EntityComponent() {
  const [loading, setLoading] = useState(false);
  const { user } = useMoralis();

  return (
    <Box padding="8">
      <Stack direction="horizontal">
        <Link href="/createnamespace">
          <Button variant="secondary">Create Namespace</Button>
        </Link>
        <Button
          loading={loading}
          variant="secondary"
          onClick={async () => {
            setLoading(true);
            // const data = await createEntity('');
            const data = await Entity.Entity.initialize(user.get('ethAddress'));
            console.log(data);
            setLoading(false);
          }}
        >
          Create Entity
        </Button>

        <Link href="/creategrant">
          <Button variant="secondary">Create Grant</Button>
        </Link>
        <Link href="/exploregrants">
          <Button variant="secondary">Explore Grants</Button>
        </Link>
        <Link href="/viewdata">
          <Button variant="secondary">View Data</Button>
        </Link>
      </Stack>
    </Box>
  );
}
