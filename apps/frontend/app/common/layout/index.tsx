import { Box } from 'degen';
import { ReactNodeNoStrings } from 'degen/dist/types/types';
import React from 'react';
import Header from './header';

type Props = {
  children: ReactNodeNoStrings;
};

export default function Layout({ children }: Props) {
  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      id="public-layout"
    >
      <Header />
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
}
