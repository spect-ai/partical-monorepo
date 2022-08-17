import { Loader } from '@partical/common';
import { Box, Button, Heading, Stack, Text } from 'degen';
import Link from 'next/link';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import AppCard from './appCard';

type props = {
  data: any[];
};

export default function ViewApps({ data }: props) {
  console.log({ data });
  if (!data) {
    return <Loader loading text="" />;
  }
  return (
    <Box>
      {data.map(({ id, name, serverId, serverURL }) => (
        <AppCard
          key={id}
          id={id}
          name={name}
          serverURL={serverURL}
          serverId={serverId}
        />
      ))}
    </Box>
  );
}
