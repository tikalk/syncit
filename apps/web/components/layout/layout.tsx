import { ReactNode } from 'react';
import Head from 'next/head';
import { Toast } from '@syncit2.0/core/components';
import { useRouter } from 'next/router';
import LeftBar from '../../sections/left-bar/left-bar';

export interface LayoutProps {
  title: string;
  children: ReactNode;
}

export function Layout({ children, title }: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        {router?.pathname?.search('auth') === -1 ? (
          <div className="drawer drawer-mobile">
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">{children}</div>
            <LeftBar />
          </div>
        ) : (
          children
        )}
      </div>
      <Toast />
    </>
  );
}

export default Layout;
