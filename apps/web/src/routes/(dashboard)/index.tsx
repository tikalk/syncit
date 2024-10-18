import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, Link, useNavigate } from "@builder.io/qwik-city";
import { AuthContext, type IAuthContext } from "~/providers/auth";
import type { IToastContext } from "~/providers/toast";
import { ToastContext } from "~/providers/toast";

export default component$(() => {
  const { status, user, logout } = useContext<IAuthContext>(AuthContext);
  const { toast } = useContext<IToastContext>(ToastContext);
  const nav = useNavigate();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track, cleanup }) => {
    track(status);
    const timeoutId = setTimeout(async () => {
      if (status.value === "loggedOut") {
        await toast({
          msg: "You must be logged in to access this page.",
          type: "success",
          timeout: 5000,
        });
        await nav("/auth/login?redirectUri=/");
      }
    }, 500);
    cleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>
      <h3 class="text-3xl text-primary">Hello {user.value?.name}</h3>
      <div class="flex gap-10">
        <Link href="/auth/login" class="btn">
          login
        </Link>
        <Link onClick$={() => logout()} class="btn">
          Logout
        </Link>
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
