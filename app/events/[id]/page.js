'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import { eventService, attendeeService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatDateTime, getErrorMessage } from '@/utils/helpers';
import { useForm } from 'react-hook-form';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendeesLoading, setAttendeesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const { isAdmin } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchEvent = useCallback(async () => {
    try {
      const response = await eventService.getById(id);
      setEvent(response.data.data.event);
      setStats(response.data.data.stats);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAttendees = useCallback(async () => {
    setAttendeesLoading(true);
    try {
      const response = await attendeeService.getAll(id, { page, limit: 10, search: search || undefined });
      setAttendees(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAttendeesLoading(false);
    }
  }, [id, page, search]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);
  useEffect(() => { fetchAttendees(); }, [fetchAttendees]);

  const onAddAttendee = async (data) => {
    try {
      await attendeeService.create(id, data);
      toast.success('Attendee added');
      setShowAddModal(false);
      reset();
      fetchAttendees();
      fetchEvent();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setBulkLoading(true);
    try {
      const response = await attendeeService.bulkUpload(id, bulkFile);
      toast.success(`Uploaded: ${response.data.data.created} created, ${response.data.data.duplicates} duplicates`);
      setShowBulkModal(false);
      setBulkFile(null);
      fetchAttendees();
      fetchEvent();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteAttendee = async () => {
    setDeleting(true);
    try {
      await attendeeService.delete(deleteId);
      toast.success('Attendee deleted');
      setDeleteId(null);
      fetchAttendees();
      fetchEvent();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleSendInvitation = async (attendeeId) => {
    try {
      await attendeeService.sendInvitation(attendeeId);
      toast.success('Invitation sent');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSendAllInvitations = async () => {
    try {
      const response = await attendeeService.sendBulkInvitations(id);
      const { sent = 0, failed = 0 } = response.data.data || {};
      if (sent === 0 && failed > 0) {
        toast.error(`Invites failed for all ${failed} guest(s)`);
      } else if (sent === 0 && failed === 0) {
        toast.error('No guests to invite');
      } else if (failed > 0) {
        toast.success(`Invites sent: ${sent}, Failed: ${failed}`);
      } else {
        toast.success(`Invites sent to ${sent} guest(s)`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSendReminders = async () => {
    try {
      const response = await attendeeService.sendBulkReminders(id);
      const { sent = 0, failed = 0 } = response.data.data || {};
      if (sent === 0 && failed > 0) {
        toast.error(`Reminders failed for all ${failed} guest(s)`);
      } else if (sent === 0 && failed === 0) {
        toast.error('No confirmed guests to remind');
      } else if (failed > 0) {
        toast.success(`Reminders sent: ${sent}, Failed: ${failed}`);
      } else {
        toast.success(`Reminders sent to ${sent} guest(s)`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSendThankYou = async () => {
    try {
      const response = await attendeeService.sendBulkThankYou(id);
      const { sent = 0, failed = 0 } = response.data.data || {};
      if (sent === 0 && failed > 0) {
        toast.error(`Thank-you emails failed for all ${failed} guest(s)`);
      } else if (sent === 0 && failed === 0) {
        toast.error('No checked-in guests for thank-you emails');
      } else if (failed > 0) {
        toast.success(`Thank-you sent: ${sent}, Failed: ${failed}`);
      } else {
        toast.success(`Thank-you sent to ${sent} guest(s)`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
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

  if (!event) return null;

  const statCards = [
    { label: 'Guests', value: stats?.total || 0, accent: 'muted' },
    { label: 'Registered', value: stats?.registered || 0, accent: 'teal' },
    { label: 'Checked in', value: stats?.checkedIn || 0, accent: 'teal' },
    { label: 'Show-up', value: `${stats?.attendanceRate || 0}%`, accent: 'teal' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="page-title break-words">{event.name}</h1>
            <StatusBadge status={event.status} />
          </div>
          <p className="page-subtitle break-words">{event.venue} · {formatDate(event.eventDate)} at {event.eventTime}</p>
        </div>
        {isAdmin && (
          <div className="page-header-actions">
            <Link href={`/events/${id}/edit`} className="btn-secondary">Edit</Link>
            <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary">Add guest</button>
          </div>
        )}
      </div>

      {event.description && (
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-stone-600">{event.description}</p>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} accent={card.accent} />
        ))}
      </div>

      <div className="table-shell">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <h2 className="text-sm font-medium text-stone-900">Guest list</h2>
          <div className="mobile-stack">
            <input
              type="text"
              placeholder="Search guests…"
              className="input-field w-full !py-2.5 text-sm sm:max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {isAdmin && (
              <>
                <button type="button" onClick={() => setShowBulkModal(true)} className="btn-secondary !py-2 text-sm">Import</button>
                <button type="button" onClick={handleSendAllInvitations} className="btn-primary !py-2 text-sm">Send invites</button>
                <button type="button" onClick={handleSendReminders} className="btn-ghost text-sm">Reminders</button>
                <button type="button" onClick={handleSendThankYou} className="btn-ghost text-sm">Thank you</button>
              </>
            )}
          </div>
        </div>

        {attendeesLoading ? (
          <div className="flex h-32 items-center justify-center"><LoadingSpinner /></div>
        ) : attendees.length === 0 ? (
          <EmptyState title="No guests yet" description="Add people to send invites." />
        ) : (
          <>
            <p className="table-scroll-hint">Swipe sideways to see more columns</p>
            <div className="table-scroll">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-surface-muted">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Email</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Mobile</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Invite</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Registration</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Check-in</th>
                  {isAdmin && <th className="px-4 py-3 font-medium text-stone-600" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {attendees.map((a) => (
                  <tr key={a._id} className="hover:bg-stone-50/80">
                    <td className="px-4 py-3.5 font-medium text-stone-900">{a.fullName}</td>
                    <td className="px-4 py-3.5 text-stone-600">{a.email}</td>
                    <td className="px-4 py-3.5 text-stone-600">{a.mobile || '—'}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.invitationStatus} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.registrationStatus} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.attendanceStatus} /></td>
                    {isAdmin && (
                      <td className="px-4 py-3.5">
                        <div className="flex gap-3">
                          <button type="button" onClick={() => handleSendInvitation(a._id)} className="text-link !text-xs">
                            Invite
                          </button>
                          <button type="button" onClick={() => setDeleteId(a._id)} className="text-xs text-red-600 hover:text-red-700">
                            Remove
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add guest">
        <form onSubmit={handleSubmit(onAddAttendee)} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input className="input-field" {...register('fullName', { required: 'Required' })} />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" className="input-field" {...register('email', { required: 'Required' })} />
          </div>
          <div>
            <label className="label">Mobile</label>
            <input className="input-field" {...register('mobile')} />
          </div>
          <div>
            <label className="label">Company</label>
            <input className="input-field" {...register('company')} />
          </div>
          <button type="submit" className="btn-primary w-full">Add Attendee</button>
        </form>
      </Modal>

      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Import guests">
        <div className="space-y-4">
          <p className="text-sm text-stone-600">
            CSV or Excel with columns: fullName, email, mobile (optional), company (optional)
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setBulkFile(e.target.files[0])}
            className="input-field"
          />
          <button onClick={handleBulkUpload} className="btn-primary w-full" disabled={!bulkFile || bulkLoading}>
            {bulkLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteAttendee}
        title="Delete Attendee"
        message="Are you sure you want to delete this attendee?"
        loading={deleting}
      />
    </DashboardLayout>
  );
}
