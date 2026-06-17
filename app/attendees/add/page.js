'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { attendeeService, eventService } from '@/services';
import { formatDate, getErrorMessage } from '@/utils/helpers';

export default function AddAttendeePage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAll({ limit: 100, sortBy: 'eventDate', sortOrder: 'asc' });
        setEvents(response.data.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await attendeeService.create(data.eventId, {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        company: data.company,
      });
      toast.success('Attendee added successfully');
      router.push(`/events/${data.eventId}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-form-wrap">
        <div className="mb-6">
          <h1 className="page-title">Add guest</h1>
          <p className="page-subtitle">Pick an event and enter their details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="label">Event *</label>
          {loadingEvents ? (
            <div className="py-2"><LoadingSpinner size="sm" /></div>
          ) : (
            <select className="input-field" {...register('eventId', { required: 'Event is required' })}>
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name} - {formatDate(event.eventDate)} ({event.venue})
                </option>
              ))}
            </select>
          )}
          {errors.eventId && <p className="mt-1 text-xs text-red-500">{errors.eventId.message}</p>}
        </div>
        <div>
          <label className="label">Full Name *</label>
          <input className="input-field" {...register('fullName', { required: 'Full name is required' })} />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="label">Email *</label>
          <input type="email" className="input-field" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Mobile</label>
          <input className="input-field" {...register('mobile')} />
        </div>
        <div>
          <label className="label">Company</label>
          <input className="input-field" {...register('company')} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Attendee'}
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
