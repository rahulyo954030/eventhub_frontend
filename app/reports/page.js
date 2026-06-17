'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FormField from '@/components/ui/FormField';
import FormSection from '@/components/ui/FormSection';
import { reportService, eventService } from '@/services';
import { downloadBlob, formatDate, getErrorMessage } from '@/utils/helpers';

export default function ReportsPage() {
  const [events, setEvents] = useState([]);
  const [type, setType] = useState('events');
  const [format, setFormat] = useState('csv');
  const [eventId, setEventId] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAll({ limit: 200 });
        setEvents(response.data.data || []);
      } catch {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const params = {
        format,
        eventId: eventId || undefined,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const response = await reportService.downloadReport(type, params);
      const ext = format === 'xlsx' ? 'xlsx' : 'csv';
      downloadBlob(response.data, `${type}-report.${ext}`);
      toast.success('Download started');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { value: 'events', label: 'Events', desc: 'All events with dates and status' },
    { value: 'attendees', label: 'Attendees', desc: 'Guest list with invite status' },
    { value: 'registrations', label: 'Registrations', desc: 'Confirmed guests only' },
    { value: 'attendance', label: 'Attendance', desc: 'Who checked in and when' },
  ];

  return (
    <DashboardLayout>
      <div className="page-form-wrap-narrow">
        <div className="mb-6">
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Export attendance and registration data as CSV or Excel.</p>
        </div>

        <div className="form-shell">
        <FormSection title="What to export" description="Pick the dataset you need.">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {reportTypes.map((rt) => (
              <button
                key={rt.value}
                type="button"
                onClick={() => setType(rt.value)}
                className={`rounded-lg border px-3 py-3 text-left transition ${
                  type === rt.value
                    ? 'border-primary-300 bg-primary-50 ring-1 ring-primary-200'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <p className="text-sm font-medium text-stone-900">{rt.label}</p>
                <p className="mt-0.5 text-xs text-stone-500">{rt.desc}</p>
              </button>
            ))}
          </div>
        </FormSection>

        <FormSection title="Filters">
          <FormField label="Event" optional>
            <select className="input-field" value={eventId} onChange={(e) => setEventId(e.target.value)}>
              <option value="">All events</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name} — {formatDate(event.eventDate)}
                </option>
              ))}
            </select>
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="From">
              <input type="date" className="input-field" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormField>
            <FormField label="To">
              <input type="date" className="input-field" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormField>
          </div>
          <FormField label="Status" optional hint="Filter by event or guest status.">
            <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="Invited">Invited</option>
              <option value="Registered">Registered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled (registration)</option>
              <option value="checked_in">Checked in</option>
              <option value="not_checked_in">Not checked in</option>
            </select>
          </FormField>
        </FormSection>

        <FormSection title="File format">
          <div className="format-toggle">
            <button
              type="button"
              className={`format-toggle-btn ${format === 'csv' ? 'format-toggle-btn-active' : ''}`}
              onClick={() => setFormat('csv')}
            >
              CSV
            </button>
            <button
              type="button"
              className={`format-toggle-btn ${format === 'xlsx' ? 'format-toggle-btn-active' : ''}`}
              onClick={() => setFormat('xlsx')}
            >
              Excel
            </button>
          </div>
        </FormSection>

        <div className="form-actions">
          <button type="button" onClick={generate} className="btn-primary" disabled={loading}>
            {loading ? 'Preparing…' : 'Download report'}
          </button>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
