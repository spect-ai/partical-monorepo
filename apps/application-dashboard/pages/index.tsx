import { Layout } from '@partical/common';
import Explore from '../app/modules/explore';
import Header from '../app/modules/header';
import Landing from '../app/modules/Landing';

export function Index() {
  return (
    <Layout header={<Header />}>
      <Explore />
    </Layout>
  );
}

export default Index;
