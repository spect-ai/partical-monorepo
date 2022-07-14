import { Box } from 'degen';
import { ReactNodeNoStrings } from 'degen/dist/types/types';
import React from 'react';

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
        display: 'flex',
        flexDirection: 'row',
      }}
      id="public-layout"
    >
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
}
