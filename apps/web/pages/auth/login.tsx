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

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        await http.post('/api/auth/login', { ...data });
        const newRoute: string = (router?.query?.from as string) ?? '/';
        router.push(newRoute);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err: any) {
        toast({
          color: 'error',
          text: err.response?.data?.message
            ? err.response?.data?.message
            : err.message,
        });
      }
    },
    [router.query]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="card-title">Sign in to your account</h2>
      <p>
        Or{' '}
        <Link href="/auth/register">
          <span className="link link-hover text-primary">
            register new account
          </span>
        </Link>
      </p>
      <div className="card w-1/3 bg-base-100 shadow-xl mt-5">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    {errors.email?.message as string}
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
                    {errors.password?.message as string}
                  </span>
                </label>
              )}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-outline btn-block"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
