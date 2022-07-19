import { useNamespace } from '@partical/react-partical';
import { Box, Heading, Stack } from 'degen';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
const AppData = dynamic(() => import('../appData'), {
  ssr: false,
});
const CreateApp = dynamic(() => import('../createApp'), {
  ssr: false,
});

export default function Dashboard() {
  const { getNamespacesByUser } = useNamespace();
  const [apps, setApps] = useState<any>();
  const { user } = useMoralis();

  useEffect(() => {
    const init = async () => {
      const res = await getNamespacesByUser(user.get('ethAddress'));
      setApps(res);
    };
    user && init();
  }, [user]);
  console.log({ apps });
  return (
    <Box padding="8">
      <Stack direction="horizontal">
        <Heading>Dashboard</Heading>
        <CreateApp />
      </Stack>
      {apps?.map((app) => {
        return <AppData app={app} key={app.appId} />;
      })}
    </Box>
  );
}
