import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { AuthContext, type IAuthContext } from "~/providers/auth";
import * as v from "valibot";
import { type InitialValues, useForm, valiForm$ } from "@modular-forms/qwik";
import { type IToastContext, ToastContext } from "~/providers/toast";

const forgotSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
});

type ForgotForm = v.InferInput<typeof forgotSchema>;

export const useFormLoader = routeLoader$<InitialValues<ForgotForm>>(() => ({
  email: "",
}));

export default component$(() => {
  const { forgot, status } = useContext<IAuthContext>(AuthContext);
  const nav = useNavigate();
  const { toast } = useContext<IToastContext>(ToastContext);

  const [forgotForm, { Form, Field }] = useForm<ForgotForm>({
    loader: useFormLoader(),
    validate: valiForm$(forgotSchema),
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
    <Form onSubmit$={forgot} class="md:w-8/12 lg:w-4/12">
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl">Recover Password</h2>
        <p>
          Please enter your email below. You will receive an email message with
          instructions on how to reset your password
        </p>
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

        <Link href="/auth/login" class="btn btn-link self-end">
          I remember my password, back to login page...{" "}
        </Link>
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
