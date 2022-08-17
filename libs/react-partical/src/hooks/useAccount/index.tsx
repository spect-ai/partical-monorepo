import { useParticalClient } from '../../provider';
import { useQuery } from '@tanstack/react-query';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
} from 'wagmi';
import { SiweMessage } from 'siwe';
import { useState } from 'react';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

export default function useParticalAccount() {
  const { connectAsync } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { particalHost } = useParticalClient();
  const { address } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { isLoading, error, data } = useQuery(
    ['user', address],
    () =>
      fetch(`${particalHost}/user/profile`, {
        credentials: 'include',
      }).then(async (res) => await res.json()),
    {
      enabled: !!particalHost && !!address,
    }
  );
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const connect = async () => {
    !address && (await connectAsync());
    setIsAuthenticating(true);
    const nonceRes = await fetch(`${particalHost}/user/nonce`, {
      credentials: 'include',
    });
    const nonce = await nonceRes.text();
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

    const verifyRes = await fetch(`${particalHost}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ message: message.prepareMessage(), signature }),
    });
    setIsAuthenticating(false);
    if (!verifyRes.ok) throw new Error('Error verifying message');
    else console.log('Verified message');
    return true;
  };

  const logout = async () => {
    const logoutRes = await fetch(`${particalHost}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!logoutRes.ok) throw new Error('Error logging out');
    else console.log('Logged out');
    disconnect();
    return true;
  };

  return {
    profile: data,
    isLoading,
    error,
    connect,
    logout,
    isAuthenticating,
  };
}
