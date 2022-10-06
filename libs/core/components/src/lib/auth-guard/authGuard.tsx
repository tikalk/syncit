import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import http from 'axios';
import { userDataState } from '@syncit2.0/core/store';
import { useSetRecoilState } from 'recoil';
import Loader from '../loader/loader';

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const statusCode = err.response.status;
    if (statusCode === 401 || statusCode === 403) {
      window.location.href = '/auth/login';
    }
    throw err;
  }
);

interface IAuthGuard {
  children: ReactNode;
}

export const AuthGuard = ({ children }: IAuthGuard) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const setUserData = useSetRecoilState(userDataState);

  const isAuthRoute = useMemo(
    () => router.pathname.search('/auth') > -1,
    [router.pathname]
  );

  const getUserData = useCallback(async () => {
    if (!isAuthRoute) {
      const { data } = await fetch({
        method: 'GET',
        url: '/api/auth/me',
      });
      setUserData(data?.userData);
      setLoading(false);
    }
  }, [isAuthRoute]);

  useEffect(() => {
    getUserData();
  }, []);

  return <>{!isAuthRoute && loading ? <Loader full /> : children}</>;
};

export default AuthGuard;
