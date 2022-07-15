import Layout from '../../app/common/layout';
import ExploreGrants from '../../app/modules/ExploreGrants';

/* eslint-disable-next-line */
export interface ExploregrantsProps {}

export function ExploregrantsPage(props: ExploregrantsProps) {
  return (
    <Layout>
      <ExploreGrants />
    </Layout>
  );
}

export default ExploregrantsPage;
