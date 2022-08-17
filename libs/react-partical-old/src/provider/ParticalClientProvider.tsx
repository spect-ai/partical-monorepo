import { ParticalClient } from '@partical/partical-js-sdk';
import React, { useEffect, useState } from 'react';

interface ParticalContextType {
  particalClient: ParticalClient;
  setParticalClient: (particalClient: ParticalClient) => void;
}

const useParticalClientProvider = () => {
  const [particalClient, setParticalClient] = useState<ParticalClient>(
    {} as ParticalClient
  );
  return {
    particalClient,
    setParticalClient,
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
  ceramicClientUri?: string;
}

export function ParticalClientProvider({
  children,
  ceramicClientUri,
}: ParticalClientProviderProps) {
  const context = useParticalClientProvider();

  useEffect(() => {
    const initClients = async () => {
      const client = new ParticalClient(ceramicClientUri);
      context.setParticalClient(client);
    };
    initClients();
  }, []);

  return (
    <ParticalClientContext.Provider value={context}>
      {children}
    </ParticalClientContext.Provider>
  );
}
