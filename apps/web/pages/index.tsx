import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '@syncit2.0/core/store';
import Layout from '../components/layout/layout';

function Index() {
  const userData = useRecoilValue(userDataState);

  return (
    <Layout title="Home">
      Welcome to syncit
      <div>{JSON.stringify(userData)}</div>
    </Layout>
  );
}

export default Index;
