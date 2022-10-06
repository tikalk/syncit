import { AppProps } from 'next/app';
import './styles.css';
import { RecoilRoot } from 'recoil';
import { AuthGuard } from '@syncit2.0/core/components';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AuthGuard>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </AuthGuard>
    </RecoilRoot>
  );
}

export default CustomApp;
