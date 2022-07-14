import CreateNamespace from '../../app/modules/CreateNamespace';
import Layout from '../../app/common/layout';

/* eslint-disable-next-line */
export interface CreateappProps {}

export function CreateNamespacePage(props: CreateappProps) {
  return (
    <Layout>
      <CreateNamespace />
    </Layout>
  );
}

export default CreateNamespacePage;
