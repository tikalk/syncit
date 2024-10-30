import { component$ } from '@builder.io/qwik';
import * as v from 'valibot';
import { useForm, valiForm$ } from '@modular-forms/qwik';
import { useSession, useUpdate } from '~/routes/plugin@auth';

const AccountSettingsSchema = v.pipe(
  v.object({
    // id: v.pipe(v.number(), v.nonEmpty('Somthing went wrong.')),
    name: v.pipe(v.string(), v.nonEmpty('Please enter your name.')),
    email: v.pipe(
      v.string(),
      v.nonEmpty('Please enter your email.'),
      v.email('The email address is badly formatted.'),
    ),
    password: v.string(),
    passwordConfirm: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['passwordConfirm']],
      (input) =>
        input.password.length === 0 ||
        (input.password === input.passwordConfirm && input.password.length > 7),
      'The two passwords do not match. or not have 7 characters or more.',
    ),
    ['passwordConfirm'],
  ),
);

export type AccountSettingsForm = v.InferInput<typeof AccountSettingsSchema>;

export const AccountSettings = component$(() => {
  const session = useSession();
  const update = useUpdate();

  const [accountSettingsForm, { Form, Field }] = useForm<AccountSettingsForm>({
    loader: {
      value: {
        // id: session.value?.id,
        name: session.value?.name ?? '',
        email: session.value?.email ?? '',
        password: '',
        passwordConfirm: '',
      },
    },
    validate: valiForm$(AccountSettingsSchema),
    validateOn: 'blur',
  });

  return (
    <div class="lg:w-full">
      <h1 class="my-5 text-3xl font-bold">Account Settings</h1>
      {/*// @ts-ignore*/}
      <Form action={update} class="flex w-full flex-col gap-4">
        <Field name="name">
          {(field, props) => (
            <div>
              <input
                {...props}
                type="text"
                value={field.value}
                placeholder="Full Name"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="email">
          {(field, props) => (
            <div>
              <input
                {...props}
                type="email"
                value={field.value}
                placeholder="Email address"
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
                placeholder="Change password"
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
                placeholder="Verify password"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="pt-1 text-sm text-error">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        {/*<Field name="id">*/}
        {/*  {(field, props) => (*/}
        {/*    <div>*/}
        {/*      <input {...props} type="hidden" value={field.value} />*/}
        {/*      {field.error && (*/}
        {/*        <div class="pt-1 text-sm text-error">{field.error}</div>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</Field>*/}
        <button
          type="submit"
          class="btn btn-primary"
          disabled={accountSettingsForm.invalid}
        >
          Update account settings
        </button>
      </Form>
    </div>
  );
});
