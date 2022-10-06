import React, { useCallback, useEffect } from 'react';
import { Loader } from '@syncit2.0/core/components';
import http from 'axios';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  const logout = useCallback(async () => {
    await http.post('/api/auth/logout');
    const newRoute: string = (router?.query?.from as string) ?? '/auth/login';
    router.push(newRoute);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }, []);

  useEffect(() => {
    logout();
  }, []);
  return <Loader full />;
};

export default Logout;
