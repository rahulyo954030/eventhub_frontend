'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormField from '@/components/ui/FormField';
import FormSection from '@/components/ui/FormSection';
import { eventService } from '@/services';
import { getErrorMessage } from '@/utils/helpers';

export default function EditEventPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getById(id);
        const event = response.data.data.event;
        reset({
          name: event.name,
          description: event.description,
          venue: event.venue,
          eventDate: event.eventDate?.split('T')[0],
          eventTime: event.eventTime,
          organizerName: event.organizerName,
          organizerEmail: event.organizerEmail,
          status: event.status,
        });
      } catch (error) {
        toast.error(getErrorMessage(error));
        router.push('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, reset, router]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await eventService.update(id, data);
      toast.success('Event updated');
      router.push(`/events/${id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const err = (field) => errors[field]?.message;

  return (
    <DashboardLayout>
      <div className="page-form-wrap">
        <div className="mb-6">
          <h1 className="page-title">Edit event</h1>
          <p className="page-subtitle">Update details before sending more invites.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form-shell">
        <FormSection title="Event details">
          <FormField label="Event name" required error={err('name')}>
            <input
              className={`input-field ${errors.name ? 'input-field-error' : ''}`}
              {...register('name', { required: 'Event name is required' })}
            />
          </FormField>
          <FormField label="Description" optional>
            <textarea className="input-field" rows={3} {...register('description')} />
          </FormField>
          <FormField label="Venue" required error={err('venue')}>
            <input
              className={`input-field ${errors.venue ? 'input-field-error' : ''}`}
              {...register('venue', { required: 'Venue is required' })}
            />
          </FormField>
        </FormSection>

        <FormSection title="Schedule">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date" required error={err('eventDate')}>
              <input
                type="date"
                className="input-field"
                {...register('eventDate', { required: 'Date is required' })}
              />
            </FormField>
            <FormField label="Time" required error={err('eventTime')}>
              <input
                type="time"
                className="input-field"
                {...register('eventTime', { required: 'Time is required' })}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Organizer">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" required>
              <input className="input-field" {...register('organizerName', { required: true })} />
            </FormField>
            <FormField label="Email" required>
              <input type="email" className="input-field" {...register('organizerEmail', { required: true })} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Status">
          <FormField label="Event status">
            <select className="input-field" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
        </FormSection>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
      </div>
    </DashboardLayout>
  );
}
