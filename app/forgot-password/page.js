'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authService } from '@/services';
import { getErrorMessage } from '@/utils/helpers';
import Logo from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
      toast.success('Check your inbox');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <header className="home-nav">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-5">
          <Logo href="/" size="sm" showText />
          <Link href="/login" className="text-sm font-medium text-ink-muted hover:text-ink">Sign in</Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-16">
        <div className="auth-card">
        <h1 className="auth-heading">Reset password</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We&apos;ll email you a link if an account exists for that address.
        </p>

        {sent ? (
          <div className="mt-8 rounded-lg border border-stone-200/80 bg-surface-muted px-4 py-5 text-sm text-ink-muted">
            If an account exists, a reset link is on its way. Check spam if you don&apos;t see it.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@company.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
