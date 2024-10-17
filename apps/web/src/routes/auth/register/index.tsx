import {component$, useContext, useVisibleTask$} from "@builder.io/qwik";
import {Link, routeLoader$, useNavigate} from "@builder.io/qwik-city";
import {AuthContext, type IAuthContext} from "~/providers/auth";
import * as v from "valibot";
import {type InitialValues, useForm, valiForm$} from "@modular-forms/qwik";
import {type IToastContext, ToastContext} from "~/providers/toast";

const RegisterSchema = v.pipe(
    v.object({
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
        passwordConfirm: v.pipe(
            v.string(),
            v.nonEmpty("Please re-enter your password."),
            v.minLength(7, "Your password must have 7 characters or more."),
        ),
        name: v.pipe(v.string(), v.nonEmpty("Please enter your name.")),
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

type RegisterForm = v.InferInput<typeof RegisterSchema>;

export const useFormLoader = routeLoader$<InitialValues<RegisterForm>>(() => ({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
}));

export default component$(() => {
    const {create, status} = useContext<IAuthContext>(AuthContext);
    const nav = useNavigate();
    const {toast} = useContext<IToastContext>(ToastContext);

    const [registerForm, {Form, Field}] = useForm<RegisterForm>({
        loader: useFormLoader(),
        validate: valiForm$(RegisterSchema),
        validateOn: "blur",
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async ({track}) => {
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
        <Form onSubmit$={create} class="md:w-8/12 lg:w-4/12">
            <div class="flex flex-col gap-4">
                <h2 class="text-2xl">Register</h2>
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
                                <div class="text-sm text-error pt-1">{field.error}</div>
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
                                <div class="text-sm text-error pt-1">{field.error}</div>
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
                                placeholder="Re-enter Password"
                                class="input input-bordered w-full"
                            />
                            {field.error && (
                                <div class="text-sm text-error pt-1">{field.error}</div>
                            )}
                        </div>
                    )}
                </Field>
                <Field name="name">
                    {(field, props) => (
                        <div>
                            <input
                                {...props}
                                type="text"
                                value={field.value}
                                placeholder="Full name"
                                class="input input-bordered w-full"
                            />
                            {field.error && (
                                <div class="text-sm text-error pt-1">{field.error}</div>
                            )}
                        </div>
                    )}
                </Field>
                <Link href="/auth/login" class="btn btn-link self-end">
                    Already have account? login...
                </Link>
                <button
                    type="submit"
                    class="btn btn-primary"
                    disabled={registerForm.invalid}
                >
                    Register
                </button>
            </div>
        </Form>
    );
});
