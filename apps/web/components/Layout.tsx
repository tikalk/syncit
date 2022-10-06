import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { Toast, Loader } from '@syncit2.0/core/components';
import LeftBar from '../sections/left-bar/left-bar';
import { useSetRecoilState } from 'recoil';
import http from 'axios';
import { userDataState } from '@syncit2.0/core/store';

interface ILayout {
  children: ReactNode;
}

const Layout = ({ children }: ILayout) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const setUserData = useSetRecoilState(userDataState);

  const isAuthRoute = useMemo(
    () => router.pathname.search('/auth') > -1,
    [router.pathname]
  );

  const getUserData = useCallback(async () => {
    if (!isAuthRoute) {
      try {
        const { data } = await http.get('/api/auth/me');
        setUserData(data.userData);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [isAuthRoute]);

  useEffect(() => {
    getUserData();
  }, []);

  if (!isAuthRoute && loading) {
    return <Loader full />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {router?.pathname?.search('auth') === -1 ? (
        <div className="drawer drawer-mobile">
          <input id="drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">{children}</div>
          <LeftBar />
        </div>
      ) : (
        children
      )}
      <Toast />
    </div>
  );
};

export default Layout;
