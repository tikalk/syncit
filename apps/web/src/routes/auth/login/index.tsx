import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { AuthContext, type IAuthContext } from "~/providers/auth";
import * as v from "valibot";
import { type InitialValues, useForm, valiForm$ } from "@modular-forms/qwik";
import { type IToastContext, ToastContext } from "~/providers/toast";

const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your password."),
    v.minLength(7, "Your password must have 7 characters or more."),
  ),
  redirectUri: v.string(),
});

type LoginForm = v.InferInput<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(
  (requestEvent) => ({
    email: "",
    password: "",
    redirectUri: requestEvent.url.searchParams.get("redirectUri") || "",
  }),
);

export default component$(() => {
  const { login, status } = useContext<IAuthContext>(AuthContext);
  const nav = useNavigate();
  const { toast } = useContext<IToastContext>(ToastContext);

  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    validate: valiForm$(LoginSchema),
    validateOn: "blur",
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track, cleanup }) => {
    track(status);
    const timeoutId = setTimeout(async () => {
      if (status.value === "loggedIn") {
        await toast({
          msg: "You are already logged in.",
          type: "success",
          timeout: 5000,
        });
        await nav("/");
      }
    }, 1000);
    cleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  return (
    <Form onSubmit$={login} class="md:w-8/12 lg:w-4/12">
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl">Login</h2>
        <Field name="email">
          {(field, props) => (
            <div>
              <input
                {...props}
                type="email"
                value={field.value}
                placeholder="Email"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <div>
              <input
                {...props}
                type="password"
                value={field.value}
                placeholder="Password"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="redirectUri">
          {(field, props) => (
            <div>
              <input {...props} type="hidden" value={field.value} />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Link href="/auth/forgot-password" class="btn btn-link self-end">
          Forgot password?
        </Link>
        <button
          type="submit"
          class="btn btn-primary"
          disabled={loginForm.invalid}
        >
          Sign in
        </button>
        <div class="divider">OR</div>
        <Link href="/auth/register" class="btn btn-secondary">
          Create an account
        </Link>
      </div>
    </Form>
  );
});
