'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { attendeeService, eventService } from '@/services';
import { formatDate, getErrorMessage } from '@/utils/helpers';

export default function BulkImportCsvPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [file, setFile] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

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

  const handleUpload = async () => {
    if (!eventId || !file) {
      toast.error('Please select event and CSV file');
      return;
    }
    setUploading(true);
    try {
      const response = await attendeeService.bulkUpload(eventId, file);
      const { created, duplicates, failed } = response.data.data;
      toast.success(`Imported: ${created}, Duplicates: ${duplicates}, Failed: ${failed.length}`);
      router.push(`/events/${eventId}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-form-wrap">
        <div className="mb-6">
          <h1 className="page-title">CSV import</h1>
          <p className="page-subtitle">Upload a guest list for one event.</p>
        </div>

        <div className="card space-y-4">
        <div>
          <label className="label">Event *</label>
          {loadingEvents ? (
            <div className="py-2"><LoadingSpinner size="sm" /></div>
          ) : (
            <select className="input-field" value={eventId} onChange={(e) => setEventId(e.target.value)}>
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name} - {formatDate(event.eventDate)} ({event.venue})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="label">CSV File *</label>
          <input
            type="file"
            accept=".csv"
            className="input-field"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="mt-1 text-xs text-stone-500">
            Columns: fullName, email, mobile (optional), company (optional)
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleUpload} className="btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload CSV'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
