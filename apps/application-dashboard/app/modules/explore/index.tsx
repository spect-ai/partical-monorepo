import { Accordian, Loader } from '@partical/common';
import { useNamespace } from '@partical/react-partical';
import { Box, Heading, Stack, Text } from 'degen';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
const AppData = dynamic(() => import('../appData'), {
  ssr: false,
});

const CreateApp = dynamic(() => import('../createApp'), {
  ssr: false,
});

export default function Explore() {
  const { getAllNamespaces, loading } = useNamespace();
  const [apps, setApps] = useState<any>();
  const { isInitialized } = useMoralis();

  useEffect(() => {
    const init = async () => {
      const res = await getAllNamespaces();
      setApps(res);
    };
    if (isInitialized) {
      init();
    }
  }, [isInitialized]);

  return (
    <Box padding="8">
      <Loader loading={loading} text="Loading" />
      <CreateApp />
      {apps?.map((app) => {
        return <AppData app={app} key={app.appId} />;
      })}
    </Box>
  );
}
