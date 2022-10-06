import Link from 'next/link';
import { FieldValues, useForm } from 'react-hook-form';
import http from 'axios';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from '@syncit2.0/core/hooks';

const schema = yup
  .object()
  .shape({
    name: yup
      .string()
      .required('Required!')
      .test(
        'Invalid name!',
        (str) => !!str && str.search(' ') > 1 && str.length > 3
      ),
    email: yup.string().email('Invalid email!').required('Required!'),
    password: yup.string().min(7, 'Password to short!').required('Required!'),
  })
  .required();

function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data: FieldValues) => {
    try {
      await http.post('/api/auth/register', { ...data });
      const newRoute: string = (router?.query?.from as string) ?? '/';
      await router.push(newRoute);
    } catch (err: any) {
      toast({ color: 'error', text: err.response?.data?.message });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="card-title">Register new account</h2>
      <p>
        Or{' '}
        <Link href="/auth/login">
          <span className="link link-hover text-primary">
            login to existing account
          </span>
        </Link>
      </p>
      <div className="card w-1/3 bg-base-100 shadow-xl mt-5">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text">Full name</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Full name"
                className={`input input-bordered w-full  ${
                  errors?.name && 'input-error'
                }`}
              />
              {errors?.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name?.message as string}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text">Email address</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="Email address"
                className={`input input-bordered w-full  ${
                  errors?.email && 'input-error'
                }`}
              />
              {errors?.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors?.email?.message as string}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className={`input input-bordered w-full  ${
                  errors?.password && 'input-error'
                }`}
              />
              {errors?.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors?.password?.message as string}
                  </span>
                </label>
              )}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-outline btn-block"
              >
                Create new account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
