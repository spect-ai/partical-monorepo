import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import 'degen/styles';
import { ThemeProvider } from 'degen';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Provider } from 'react-supabase';
import {
  configureChains,
  createClient as createWagmiClient,
  defaultChains,
  WagmiConfig,
} from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { getDefaultProvider } from 'ethers';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const client = createSupabaseClient(
  'https://pdklnrniahkmzattdpzx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBka2xucm5pYWhrbXphdHRkcHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc3Mjc4NTQsImV4cCI6MTk3MzMwMzg1NH0.PgP5Gy2swmstoZlLBjCgfbwLRQIfxJsH8EET42KTLQg'
);

const alchemyId = '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC';

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({
    apiKey: alchemyId,
  }),
  publicProvider(),
]);

const wagmiclient = createWagmiClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to app!</title>
      </Head>
      <Provider value={client}>
        <WagmiConfig client={wagmiclient}>
          <ThemeProvider defaultMode="dark" defaultAccent="pink">
            <Component {...pageProps} />
          </ThemeProvider>
        </WagmiConfig>
      </Provider>
    </>
  );
}

export default CustomApp;
