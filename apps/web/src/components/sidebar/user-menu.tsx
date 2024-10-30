import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useSession, useSignOut } from '~/routes/plugin@auth';

export const UserMenu = component$(() => {
  const session = useSession();
  const signOut = useSignOut();

  return (
    <div class="card flex flex-row items-center justify-between bg-base-100 p-4">
      <div class="flex flex-1 items-center gap-4">
        {session.value?.avatar ? (
          <div class="avatar">
            <div class="w-24 rounded-full">
              <img src={session.value.avatar} alt={session.value.name ?? 'avatar'} />
            </div>
          </div>
        ) : (
          <div class="avatar placeholder">
            <div class="w-12 rounded-full bg-neutral text-neutral-content">
              <span>
                {session.value?.name?.[0]}{' '}
                {session.value?.name?.[session.value.name.indexOf(' ') + 1]}
              </span>
            </div>
          </div>
        )}
        <div>{session.value?.name}</div>
      </div>
      <div class="tooltip" data-tip="Logout">
        <Link
          onClick$={() => signOut.submit({ redirectTo: '/auth/login' })}
          class="btn btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={1.5}
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
});
