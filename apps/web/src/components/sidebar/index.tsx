import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import Image from '~/media/cal-sync-logo.png?jsx';
import { UserMenu } from '~/components/sidebar/user-menu';

export const Index = component$(() => {

  return (
    <div class="flex h-screen w-80 flex-col justify-between bg-base-200 p-4">
      <div class="flex w-full flex-col">
        <Link href="/" class="mx-auto">
          <Image style={{ width: "100px" }} />
        </Link>

        <ul class="menu">
          <li>
            <h2 class="menu-title">Settings</h2>
            <ul>
              <li>
                <Link href="/">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  Calendars
                </Link>
              </li>
              <li>
                <Link href="/settings/profile">
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
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  My profile
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <UserMenu />
    </div>
  );
});
export default Index;
