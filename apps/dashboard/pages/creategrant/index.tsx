import Layout from '../../app/common/layout';
import CreateGrant from '../../app/modules/CreateGrant';
/* eslint-disable-next-line */
export interface CreategrantProps {}

export function CreategrantPage(props: CreategrantProps) {
  return (
    <Layout>
      <CreateGrant />
    </Layout>
  );
}

export default CreategrantPage;
