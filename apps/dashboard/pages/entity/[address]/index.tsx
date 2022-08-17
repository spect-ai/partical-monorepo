import { Layout } from '@partical/common';
import { Box } from 'degen';
import EntityDashboard from '../../../app/modules/entityDashboard';

export function Address() {
  return (
    <Box
      backgroundColor="background"
      style={{
        height: '100vh',
      }}
    >
      <Box paddingTop="32">
        <EntityDashboard />
      </Box>
    </Box>
  );
}

export default Address;
