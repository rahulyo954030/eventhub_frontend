'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authService } from '@/services';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getErrorMessage } from '@/utils/helpers';
import Logo from '@/components/ui/Logo';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const run = async () => {
      const timeoutId = setTimeout(() => {
        setStatus('error');
        setMessage('Verification timed out. Try the link from your email again.');
      }, 12000);

      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email is verified. You can sign in now.');
        toast.success('Email verified');
      } catch (error) {
        setStatus('error');
        setMessage(getErrorMessage(error));
      } finally {
        clearTimeout(timeoutId);
      }
    };

    run();
  }, [searchParams]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-surface">
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex h-14 max-w-lg items-center px-5">
            <Logo href="/" size="sm" showText />
          </div>
        </header>
        <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-16">
          <LoadingSpinner />
          <p className="mt-4 text-sm text-stone-600">Verifying your email…</p>
        </div>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-lg items-center px-5">
          <Logo href="/" size="sm" showText />
        </div>
      </header>
      <div className="mx-auto max-w-lg px-5 py-14">
        <h1 className="auth-heading">
          {isSuccess ? 'Email verified' : 'Couldn\u2019t verify'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{message}</p>
        <div className="mt-8">
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingSpinner />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
