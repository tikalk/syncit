import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { AuthContext, type IAuthContext } from '~/providers/auth';

export default component$(() => {
  const { user, logout } = useContext<IAuthContext>(AuthContext);
  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>
      <h3 class="text-primary text-3xk">Hello {user.value?.name}</h3>
      <div class="flex gap-10">
        <Link href="/auth/login" class="btn">login</Link>
        <Link onClick$={() => logout()} class="btn">Logout</Link>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Syncit",
  meta: [
    {
      name: "description",
      content: "We make it easy to sync your calendars in real time.",
    },
  ],
};
