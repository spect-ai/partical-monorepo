import { Box } from 'degen';
import Landing from '../app/modules/Landing';
export function Index() {
  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
      }}
    >
      <Box paddingTop="32">
        <Landing />
      </Box>
    </Box>
  );
}

export default Index;
