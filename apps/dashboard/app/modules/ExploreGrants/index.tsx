import { Stream } from '@partical/partical-js-sdk';
import { Box, Heading, Spinner, Stack } from 'degen';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function ExploreGrants() {
  const [loading, setLoading] = useState(false);
  const [grants, setGrants] = useState<any>();

  useEffect(() => {
    const getGrants = async () => {
      setLoading(true);
      const streamSDK = new Stream.StreamData({
        apiKey: 'AYWKcYZ64wxvECM8IfDmdU6nj6zVZ+Jbe4C2Ue3aL+w=',
      });
      const res = await streamSDK.getAppData('wTao5gHcMP8wEoVROtMNZ3Iz');
      setGrants(res);
      setLoading(false);
    };
    getGrants();
  }, []);

  return (
    <Box padding="8">
      <Link href="/">Go back</Link>
      <Heading>Explore grants</Heading>
      {loading && <Spinner size="large" color="accent" />}
      <Stack>
        {!loading &&
          grants?.map((grant: any) => (
            <Stack direction="horizontal" key={grant.streamId}>
              <Heading>{grant.grantAddress}</Heading>
              <Heading>{grant.grantName}</Heading>
              <Heading>{grant.grantDescription}</Heading>
            </Stack>
          ))}
      </Stack>
    </Box>
  );
}
