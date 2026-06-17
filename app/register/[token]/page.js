'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { registrationService } from '@/services';
import { getErrorMessage, formatDate } from '@/utils/helpers';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormField from '@/components/ui/FormField';
import Logo from '@/components/ui/Logo';

export default function RegisterPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await registrationService.getByToken(token);
        setData(response.data.data);
        reset({
          fullName: response.data.data.attendee.fullName,
          email: response.data.data.attendee.email,
          mobile: response.data.data.attendee.mobile,
          company: response.data.data.attendee.company,
        });
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await registrationService.confirm(token, formData);
      toast.success('You are registered');
      const response = await registrationService.getByToken(token);
      setData(response.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRegistration = async () => {
    try {
      await registrationService.cancel(token);
      toast.success('Registration cancelled');
      const response = await registrationService.getByToken(token);
      setData(response.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl text-stone-900">Link not valid</h1>
          <p className="mt-2 text-sm text-stone-600">
            This registration link may have expired or already been used.
          </p>
        </div>
      </div>
    );
  }

  const isConfirmed = data.attendee?.registrationStatus === 'confirmed';
  const isCancelled = data.attendee?.registrationStatus === 'cancelled' || data.attendee?.invitationStatus === 'Cancelled';

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-lg items-center px-5">
          <Logo size="sm" showText />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
          You&apos;re invited
        </p>
        <h1 className="font-display mt-3 text-[2rem] font-semibold leading-tight tracking-display text-stone-900 sm:text-[2.35rem]">{data.event.name}</h1>

        <dl className="mt-6 space-y-2 border-y border-stone-200 py-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Date</dt>
            <dd className="text-stone-800">{formatDate(data.event.eventDate)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Time</dt>
            <dd className="text-stone-800">{data.event.eventTime}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Venue</dt>
            <dd className="text-right text-stone-800">{data.event.venue}</dd>
          </div>
        </dl>

        {isConfirmed ? (
          <div className="mt-8 rounded-lg border border-primary-200 bg-primary-50 px-4 py-5">
            <p className="font-medium text-primary-900">You&apos;re confirmed</p>
            <p className="mt-1 text-sm text-primary-800">
              We have your details. Bring your QR code to the event for check-in.
            </p>
          </div>
        ) : isCancelled ? (
          <div className="mt-8 rounded-lg border border-stone-200 bg-white px-4 py-5">
            <p className="font-medium text-stone-900">Registration cancelled</p>
            <p className="mt-1 text-sm text-stone-600">
              You previously declined this invitation.
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-sm text-stone-600">
              Confirm your details below so we know you&apos;re coming.
            </p>
            <FormField label="Full name" required error={errors.fullName?.message}>
              <input
                className={`input-field ${errors.fullName ? 'input-field-error' : ''}`}
                {...register('fullName', { required: 'Name is required' })}
              />
            </FormField>
            <FormField label="Email" required>
              <input type="email" className="input-field" {...register('email', { required: 'Email is required' })} />
            </FormField>
            <FormField label="Mobile" required>
              <input className="input-field" {...register('mobile', { required: 'Mobile is required' })} />
            </FormField>
            <FormField label="Company" optional>
              <input className="input-field" {...register('company')} />
            </FormField>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : 'Confirm attendance'}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelRegistration}>
                Can&apos;t make it
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
