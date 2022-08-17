import { Box } from 'degen';
import { ReactNodeNoStrings } from 'degen/dist/types/types';
import React from 'react';
import styled from 'styled-components';
import Footer from './footer';
import Header from './header';

type Props = {
  children: ReactNodeNoStrings;
  header?: ReactNodeNoStrings;
  footer?: ReactNodeNoStrings;
};

const Container = styled(Box)`
  flex-grow: 1;
`;

export default function Layout({ children, header, footer }: Props) {
  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      id="public-layout"
    >
      {header ? header : <Header />}
      <Container>{children}</Container>
      {/* {footer ? footer : <Footer />} */}
    </Box>
  );
}
