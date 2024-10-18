import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { AuthContext, type IAuthContext } from "~/providers/auth";
import * as v from "valibot";
import { type InitialValues, useForm, valiForm$ } from "@modular-forms/qwik";
import { type IToastContext, ToastContext } from "~/providers/toast";

const resetSchema = v.pipe(
  v.object({
    password: v.pipe(
      v.string(),
      v.nonEmpty("Please re-enter your password."),
      v.minLength(7, "Your password must have 7 characters or more."),
    ),
    passwordConfirm: v.pipe(
      v.string(),
      v.nonEmpty("Please re-enter your password."),
      v.minLength(7, "Your password must have 7 characters or more."),
    ),
    token: v.pipe(v.string(), v.nonEmpty("Missing token.")),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["passwordConfirm"]],
      (input) => input.password === input.passwordConfirm,
      "The two passwords do not match.",
    ),
    ["passwordConfirm"],
  ),
);

type ResetForm = v.InferInput<typeof resetSchema>;

export const useFormLoader = routeLoader$<InitialValues<ResetForm>>(
  (requestEvent) => ({
    password: "",
    passwordConfirm: "",
    token: requestEvent.url.searchParams.get("token") || "",
  }),
);

export default component$(() => {
  const { reset, status } = useContext<IAuthContext>(AuthContext);
  const nav = useNavigate();
  const { toast } = useContext<IToastContext>(ToastContext);

  const [forgotForm, { Form, Field }] = useForm<ResetForm>({
    loader: useFormLoader(),
    validate: valiForm$(resetSchema),
    validateOn: "blur",
  });

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
    <Form onSubmit$={reset} class="md:w-8/12 lg:w-4/12">
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl">Reset Password</h2>
        <p>Please enter a new password below.</p>

        <Field name="password">
          {(field, props) => (
            <div>
              <input
                {...props}
                type="password"
                value={field.value}
                placeholder="New password"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="passwordConfirm">
          {(field, props) => (
            <div>
              <input
                {...props}
                type="password"
                value={field.value}
                placeholder="New password verify"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="token">
          {(field, props) => (
            <div>
              <input
                {...props}
                type="hidden"
                value={field.value}
                placeholder="Token"
              />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <button
          type="submit"
          class="btn btn-primary"
          disabled={forgotForm.invalid}
        >
          Recover Password
        </button>
      </div>
    </Form>
  );
});
