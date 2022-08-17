import { ThemeProvider } from 'degen';
import { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import 'degen/styles';
import './styles.css';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import { Provider } from 'react-supabase';
import { createClient } from '@supabase/supabase-js';

const client = createClient(
  'https://pdklnrniahkmzattdpzx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBka2xucm5pYWhrbXphdHRkcHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc3Mjc4NTQsImV4cCI6MTk3MzMwMzg1NH0.PgP5Gy2swmstoZlLBjCgfbwLRQIfxJsH8EET42KTLQg'
);

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ThemeProvider defaultMode="dark" defaultAccent="foreground">
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default CustomApp;
