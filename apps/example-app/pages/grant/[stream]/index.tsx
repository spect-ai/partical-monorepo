import Header from '../../../components/Header';
import { Box, Heading } from 'degen';
import { useStream } from '@partical/react-partical';
import { useRouter } from 'next/router';
import { GrantData } from '../../createGrant';
import Link from 'next/link';

export function Stream() {
  const router = useRouter();
  const { stream } = router.query;
  const { streamData, loading, error, metadata } = useStream<GrantData>(
    stream as string
  );

  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
      }}
    >
      <Header />
      <Link href="/">Go back</Link>
      {loading && <Heading>Loading...</Heading>}
      <Heading>{error}</Heading>
      <Box>
        <Heading>{streamData?.title}</Heading>
        <Heading>{metadata?.family}</Heading>
      </Box>
    </Box>
  );
}

export default Stream;
