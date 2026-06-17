'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authService } from '@/services';
import { getErrorMessage } from '@/utils/helpers';
import Logo from '@/components/ui/Logo';

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ token, password: data.password });
      toast.success('Password updated');
      router.push('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
        This link is invalid or expired. Request a new one from the sign-in page.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <div>
        <label className="label">New password</label>
        <input
          type="password"
          className="input-field"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>
      <div>
        <label className="label">Confirm password</label>
        <input
          type="password"
          className="input-field"
          {...register('confirmPassword', {
            required: 'Please confirm',
            validate: (val) => val === watch('password') || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-lg items-center px-5">
          <Logo href="/" size="sm" showText />
        </div>
      </header>
      <div className="mx-auto max-w-lg px-5 py-12 sm:py-16">
        <h1 className="auth-heading">New password</h1>
        <p className="mt-2 text-sm text-stone-600">Choose something you haven&apos;t used here before.</p>
        <Suspense fallback={<p className="mt-8 text-sm text-stone-500">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
