import { component$, Slot } from '@builder.io/qwik';
import Image from '~/media/cal-sync-logo.png?jsx';


// export const onRequest: RequestHandler = (event) => {
//   // const session = event.sharedMap.get('session');
//   // if (session) {
//   //   throw event.redirect(302, `/`);
//   // }
// };

export const Layout = component$(() => {
  return (
    <div class="container mx-5 flex h-screen flex-col items-center justify-center lg:mx-auto">
      <Image style={{ width: '250px' }} />
      <Slot />
    </div>
  );
});
export default Layout;