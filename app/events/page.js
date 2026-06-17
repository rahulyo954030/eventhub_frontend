'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import TableIconAction from '@/components/ui/TableIconAction';
import { eventService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getErrorMessage } from '@/utils/helpers';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { isAdmin } = useAuth();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await eventService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setEvents(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await eventService.delete(deleteId);
      toast.success('Event deleted');
      setDeleteId(null);
      fetchEvents();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleArchive = async (id) => {
    try {
      await eventService.archive(id);
      toast.success('Event archived');
      fetchEvents();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handlePublish = async (id) => {
    try {
      await eventService.publish(id);
      toast.success('Event published');
      fetchEvents();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Create, publish, and manage your event list.</p>
        </div>
        {isAdmin && (
          <Link href="/events/create" className="btn-primary w-full sm:w-auto">
            New event
          </Link>
        )}
      </div>

      <div className="table-shell">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by name or venue…"
              className="input-field sm:max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select
              className="input-field sm:max-w-[180px]"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          {pagination?.total ? (
            <p className="text-xs text-stone-500">{pagination.total} events</p>
          ) : null}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Create your first event to start inviting guests."
            action={isAdmin && <Link href="/events/create" className="btn-primary">New event</Link>}
          />
        ) : (
          <>
            <p className="table-scroll-hint">Swipe sideways to see more columns</p>
            <div className="table-scroll">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-surface-muted">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Venue</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Date</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Status</th>
                  <th className="px-4 py-3 font-medium text-stone-600" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-stone-50/80">
                    <td className="px-4 py-3.5 font-medium text-stone-900">{event.name}</td>
                    <td className="px-4 py-3.5 text-stone-600">{event.venue}</td>
                    <td className="px-4 py-3.5 text-stone-600">{formatDate(event.eventDate)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={event.status} /></td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <TableIconAction icon="open" label="Open" href={`/events/${event._id}`} variant="primary" />
                        {isAdmin && (
                          <>
                            <TableIconAction icon="edit" label="Edit" href={`/events/${event._id}/edit`} />
                            {event.status === 'draft' && (
                              <TableIconAction icon="publish" label="Publish" onClick={() => handlePublish(event._id)} />
                            )}
                            {event.status !== 'archived' && (
                              <TableIconAction icon="archive" label="Archive" onClick={() => handleArchive(event._id)} />
                            )}
                            <TableIconAction icon="delete" label="Delete" variant="danger" onClick={() => setDeleteId(event._id)} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete event"
        message="This permanently deletes the event and all its attendees. This cannot be undone."
        loading={deleting}
      />
    </DashboardLayout>
  );
}
