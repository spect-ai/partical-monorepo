import { ThemeProvider } from 'degen';
import { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import 'degen/styles';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID as string}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL as string}
    >
      <ThemeProvider defaultMode="dark" defaultAccent="indigo">
        <Component {...pageProps} />
      </ThemeProvider>
    </MoralisProvider>
  );
}

export default CustomApp;