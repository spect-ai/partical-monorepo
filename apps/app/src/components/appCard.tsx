import { Box, Button, Heading, Stack } from 'degen';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useUpdate } from 'react-supabase';
import { SiweMessage } from 'siwe';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { cloudflare, digitalOcean } from '../adapter';

type Props = {
  id: string;
  name: string;
  serverId: string;
  serverURL: string;
};

export default function AppCard({ id, name, serverId, serverURL }: Props) {
  const [dropletIp, setDropletIp] = useState('');
  const { address } = useAccount();
  const { connectAsync } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { chain: activeChain } = useNetwork();
  const [loading, setLoading] = useState(false);
  const { signMessageAsync } = useSignMessage();

  const [isAuth, setisAuth] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // const waitForServerToBeReady = async (host: string) => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(host);
  //     if (res.ok) {
  //       setLoading(false);
  //       return true;
  //     } else {
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //       return waitForServerToBeReady(host);
  //     }
  //   } catch (e) {
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     return waitForServerToBeReady(host);
  //   }
  // };

  // useEffect(() => {
  //   waitForServerToBeReady(serverURL);
  // }, [serverURL]);

  return (
    <Box
      key={id}
      width="1/4"
      borderWidth="0.375"
      padding="4"
      borderRadius="2xLarge"
      borderColor="accentSecondary"
      cursor="pointer"
      onClick={() => {
        router.push(`/${serverId}`);
      }}
    >
      <Stack>
        <Heading>{name}</Heading>
        <Stack direction="horizontal">
          {!isAuth && (
            <Button
              variant="tertiary"
              size="small"
              loading={loading}
              onClick={async () => {
                // console.log(`https://particaltest7.partical.xyz/user/nonce`);
                const nonceRes = await fetch(`${serverURL}/user/nonce`, {
                  credentials: 'include',
                });
                const nonce = await nonceRes.text();
                // const nonce = 'aaaa';
                console.log({ nonce });
                const message = new SiweMessage({
                  domain: window.location.host,
                  address,
                  statement: 'Sign in with Ethereum to the app.',
                  uri: window.location.origin,
                  version: '1',
                  chainId: activeChain?.id,
                  nonce,
                });
                const signature = await signMessageAsync({
                  message: message.prepareMessage(),
                });
                console.log(
                  JSON.stringify({
                    message,
                    signature,
                    signedMessage: message.prepareMessage(),
                  })
                );

                const verifyRes = await fetch(`${serverURL}/user/login`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    message,
                    signature,
                    signedMessage: message.prepareMessage(),
                  }),
                });
                if (!verifyRes.ok) throw new Error('Error verifying message');
                else console.log('Verified message');
                setisAuth(true);
              }}
            >
              Login
            </Button>
          )}
          {/* {isAuth && (
            <Link href={`${serverURL}/console`} target="_blank">
              <Button size="small" variant="secondary">
                Go to console
              </Button>
            </Link>
          )} */}
        </Stack>
      </Stack>
    </Box>
  );
}
