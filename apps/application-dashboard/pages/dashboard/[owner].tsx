import { Layout } from '@partical/common';
import Header from '../../app/modules/header';
import Dashboard from '../../app/modules/dashboard';

export function DashboardPage() {
  return (
    <Layout header={<Header />}>
      <Dashboard />
    </Layout>
  );
}

export default DashboardPage;
