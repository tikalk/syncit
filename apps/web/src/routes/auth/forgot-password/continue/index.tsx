import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { AuthContext, type IAuthContext } from "~/providers/auth";
import { type IToastContext, ToastContext } from "~/providers/toast";

export default component$(() => {
  const { status } = useContext<IAuthContext>(AuthContext);

  const nav = useNavigate();
  const { toast } = useContext<IToastContext>(ToastContext);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(status);
    if (status.value === "loggedIn") {
      await toast({
        msg: "You are already logged in.",
        type: "success",
        timeout: 5000,
      });
      await nav("/");
    }
  });

  return (
    <div class="md:w-8/12 lg:w-4/12">
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl">Continue in email</h2>
        <p>
          We have sent you an email with instructions on how to reset your
          password. Please check your email.
        </p>
        <p> If you did not receive an email, please check your spam folder.</p>
        <p>
          If you need help, please{" "}
          <Link href="/contact" class="link">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
});
