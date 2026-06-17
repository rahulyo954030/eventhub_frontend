'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAuthFeedback } from '@/utils/helpers';
import { getPostLoginPath } from '@/utils/authRedirect';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormField from '@/components/ui/FormField';
import FormAlert from '@/components/ui/FormAlert';
import PasswordInput from '@/components/ui/PasswordInput';
import Logo from '@/components/ui/Logo';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const afterLoginPath = getPostLoginPath(searchParams);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(afterLoginPath);
    }
  }, [authLoading, isAuthenticated, router, afterLoginPath]);

  const onSubmit = async (data) => {
    setLoading(true);
    setFormMessage(null);
    try {
      await login(data);
      router.replace(afterLoginPath);
    } catch (error) {
      const feedback = getAuthFeedback(error);
      setFormMessage({
        variant: feedback.variant,
        title: feedback.title,
        message: feedback.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <header className="home-nav">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-5">
          <Logo href="/" size="sm" showText />
          <Link href="/signup" className="text-sm font-medium text-ink-muted hover:text-ink">
            Sign up
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-lg flex-col justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-16">
        <div className="auth-card">
        <h1 className="auth-heading">Sign in</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Use the email and password for your staff account.
        </p>

        {formMessage && (
          <div className="mt-6">
            <FormAlert variant={formMessage.variant} title={formMessage.title}>
              {formMessage.message}
              {formMessage.title === 'Email not verified' && (
                <>
                  {' '}
                  <Link href="/signup" className="font-semibold text-red-800 underline-offset-2 hover:underline">
                    Create a new account
                  </Link>
                </>
              )}
            </FormAlert>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField label="Email" error={errors.email?.message}>
            <input
              type="email"
              className={`input-field ${errors.email ? 'input-field-error' : ''}`}
              placeholder="you@company.com"
              {...register('email', { required: 'Email is required' })}
            />
          </FormField>
          <FormField
            label="Password"
            error={errors.password?.message}
            labelExtra={
              <Link href="/forgot-password" className="text-xs text-primary-700 hover:text-primary-800">
                Forgot?
              </Link>
            }
          >
            <PasswordInput
              className={errors.password ? 'input-field-error' : ''}
              {...register('password', { required: 'Password is required' })}
            />
          </FormField>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-faint">
          No account yet?{' '}
          <Link href="/signup" className="font-semibold text-primary-700 hover:text-primary-800">
            Create one
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={(
        <div className="flex h-screen items-center justify-center bg-surface">
          <LoadingSpinner size="lg" />
        </div>
      )}
    >
      <LoginForm />
    </Suspense>
  );
}
