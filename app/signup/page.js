'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { getAuthFeedback } from '@/utils/helpers';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormField from '@/components/ui/FormField';
import FormAlert from '@/components/ui/FormAlert';
import Logo from '@/components/ui/Logo';

function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams?.get('invite');
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  const onSubmit = async (data) => {
    setLoading(true);
    setFormMessage(null);
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        ...(inviteToken ? { inviteToken } : {}),
      });
      const role = response?.data?.data?.role;
      reset();
      setFormMessage({
        variant: 'success',
        title: 'Account created',
        message: role === 'Admin'
          ? 'We sent a verification link to your email. Please check your inbox (and spam), verify your account, then sign in.'
          : 'We sent a verification link to your email. Please check your inbox (and spam), verify your account, then sign in as Event Staff.',
      });
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
          <Link href="/login" className="text-sm font-medium text-ink-muted hover:text-ink">
            Sign in
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-lg flex-col justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-16">
        <div className="auth-card">
        <h1 className="auth-heading">Create account</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {inviteToken
            ? 'Complete signup to join as Event Staff.'
            : 'First person to sign up becomes admin if none exists yet.'}
        </p>

        {formMessage && (
          <div className="mt-6">
            <FormAlert variant={formMessage.variant} title={formMessage.title}>
              {formMessage.message}
              {formMessage.variant === 'success' && (
                <>
                  {' '}
                  <Link href="/login" className="font-semibold text-primary-800 underline-offset-2 hover:underline">
                    Go to sign in
                  </Link>
                </>
              )}
              {formMessage.title === 'Email already registered' && (
                <>
                  {' '}
                  <Link href="/login" className="font-semibold text-red-800 underline-offset-2 hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </FormAlert>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField label="Your name" required error={errors.name?.message}>
            <input
              className={`input-field ${errors.name ? 'input-field-error' : ''}`}
              {...register('name', { required: 'Name is required' })}
            />
          </FormField>
          <FormField label="Work email" required error={errors.email?.message}>
            <input
              type="email"
              className={`input-field ${errors.email ? 'input-field-error' : ''}`}
              {...register('email', { required: 'Email is required' })}
            />
          </FormField>
          <FormField label="Password" required error={errors.password?.message} hint="At least 8 characters.">
            <input
              type="password"
              className={`input-field ${errors.password ? 'input-field-error' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
            />
          </FormField>
          <FormField label="Confirm password" required error={errors.confirmPassword?.message}>
            <input
              type="password"
              className={`input-field ${errors.confirmPassword ? 'input-field-error' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
            />
          </FormField>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-faint">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-primary-700 hover:text-primary-800">
            Sign in
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={(
        <div className="flex h-screen items-center justify-center bg-surface">
          <LoadingSpinner size="lg" />
        </div>
      )}
    >
      <SignupForm />
    </Suspense>
  );
}
