'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FormField from '@/components/ui/FormField';
import FormSection from '@/components/ui/FormSection';
import { eventService } from '@/services';
import { getErrorMessage } from '@/utils/helpers';

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { status: 'draft' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await eventService.create(data);
      toast.success('Event created');
      router.push(`/events/${response.data.data._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const err = (field) => errors[field]?.message;

  return (
    <DashboardLayout>
      <div className="page-form-wrap">
        <div className="mb-6">
          <h1 className="page-title">New event</h1>
          <p className="page-subtitle">The basics — you can add guests after saving.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form-shell">
        <FormSection title="Event details" description="What guests will see on their invite.">
          <FormField label="Event name" required error={err('name')}>
            <input
              className={`input-field ${errors.name ? 'input-field-error' : ''}`}
              placeholder="Annual team meetup"
              {...register('name', { required: 'Event name is required' })}
            />
          </FormField>
          <FormField label="Description" optional hint="Shown on the registration page.">
            <textarea
              className="input-field"
              rows={3}
              placeholder="A short note about the event…"
              {...register('description')}
            />
          </FormField>
          <FormField label="Venue" required error={err('venue')}>
            <input
              className={`input-field ${errors.venue ? 'input-field-error' : ''}`}
              placeholder="Grand Ballroom, Mumbai"
              {...register('venue', { required: 'Venue is required' })}
            />
          </FormField>
        </FormSection>

        <FormSection title="Schedule" description="Date and time for check-in and reminders.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date" required error={err('eventDate')}>
              <input
                type="date"
                className={`input-field ${errors.eventDate ? 'input-field-error' : ''}`}
                {...register('eventDate', { required: 'Date is required' })}
              />
            </FormField>
            <FormField label="Time" required error={err('eventTime')}>
              <input
                type="time"
                className={`input-field ${errors.eventTime ? 'input-field-error' : ''}`}
                {...register('eventTime', { required: 'Time is required' })}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Organizer" description="Contact info for guest emails.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" required error={err('organizerName')}>
              <input
                className={`input-field ${errors.organizerName ? 'input-field-error' : ''}`}
                {...register('organizerName', { required: 'Organizer name is required' })}
              />
            </FormField>
            <FormField label="Email" required error={err('organizerEmail')}>
              <input
                type="email"
                className={`input-field ${errors.organizerEmail ? 'input-field-error' : ''}`}
                {...register('organizerEmail', { required: 'Organizer email is required' })}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Visibility">
          <FormField label="Status" hint="Draft events are hidden from guest flows until published.">
            <select className="input-field" {...register('status')}>
              <option value="draft">Draft — not visible to guests</option>
              <option value="published">Published — ready for invites</option>
            </select>
          </FormField>
        </FormSection>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create event'}
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
