import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

interface ParticalContextType {
  particalHost: string;
  setParticalHost: React.Dispatch<React.SetStateAction<string>>;
}

const useParticalClientProvider = () => {
  const [particalHost, setParticalHost] = useState('');

  return {
    particalHost,
    setParticalHost,
  };
};

const ParticalClientContext = React.createContext<ParticalContextType>(
  {} as ParticalContextType
);

export const useParticalClient = () => {
  const context = React.useContext(ParticalClientContext);
  if (context === undefined) {
    throw new Error(
      'useParticalClient must be used within a ParticalClientProvider'
    );
  }
  return context;
};

export interface ParticalClientProviderProps {
  children: React.ReactNode;
  particalClientUri: string;
}

export function ParticalClientProvider({
  children,
  particalClientUri,
}: ParticalClientProviderProps) {
  const context = useParticalClientProvider();

  useEffect(() => {
    const initClients = async () => {
      context.setParticalHost(particalClientUri);
    };
    initClients();
  }, []);

  const queryClient = new QueryClient();
  const alchemyId = '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC';

  const { chains, provider, webSocketProvider } = configureChains(
    defaultChains,
    [
      alchemyProvider({
        apiKey: alchemyId,
      }),
      publicProvider(),
    ]
  );

  const wagmiClient = createClient({
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

  return (
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <ParticalClientContext.Provider value={context}>
          {children}
        </ParticalClientContext.Provider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
