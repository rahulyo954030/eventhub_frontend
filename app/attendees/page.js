'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { eventService } from '@/services';
import { formatDate } from '@/utils/helpers';

export default function AttendeesPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventService.getAll({ limit: 100, status: 'published' }).then((res) => setEvents(res.data.data || []));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Attendees</h1>
          <p className="page-subtitle">Pick an event to manage invites and guest lists.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/attendees/add" className="btn-secondary text-sm">Add guest</Link>
          <Link href="/attendees/bulk-import-csv" className="btn-ghost text-sm">CSV import</Link>
          <Link href="/attendees/bulk-import-excel" className="btn-ghost text-sm">Excel import</Link>
        </div>
      </div>

      <div className="table-shell">
        <p className="table-scroll-hint">Swipe sideways to see more columns</p>
        <div className="table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-surface-muted">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-600">Event</th>
                <th className="px-4 py-3 font-medium text-stone-600">Date</th>
                <th className="px-4 py-3 font-medium text-stone-600">Venue</th>
                <th className="px-4 py-3 font-medium text-stone-600" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-stone-500">
                    No published events yet.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-stone-50/80">
                    <td className="px-4 py-3.5 font-medium text-stone-900">{event.name}</td>
                    <td className="px-4 py-3.5 text-stone-600">{formatDate(event.eventDate)}</td>
                    <td className="px-4 py-3.5 text-stone-600">{event.venue}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Link href={`/events/${event._id}`} className="text-link">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
