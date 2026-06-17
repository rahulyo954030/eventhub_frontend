'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FormField from '@/components/ui/FormField';
import FormSection from '@/components/ui/FormSection';
import FormAlert from '@/components/ui/FormAlert';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { getAuthFeedback, getErrorMessage } from '@/utils/helpers';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [roleActionId, setRoleActionId] = useState(null);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [roleMessage, setRoleMessage] = useState(null);
  const [team, setTeam] = useState({ members: [], adminCount: 0 });
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const inviteForm = useForm();

  const isAdmin = user?.role === 'Admin';

  const fetchTeam = useCallback(async () => {
    if (!isAdmin) return;
    setTeamLoading(true);
    try {
      const response = await authService.getTeamMembers();
      setTeam(response.data.data || { members: [], adminCount: 0 });
    } catch (error) {
      setRoleMessage({
        variant: 'error',
        title: 'Could not load team',
        message: getErrorMessage(error),
      });
    } finally {
      setTeamLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed');
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const sendStaffInvite = async (data) => {
    setInviting(true);
    setInviteMessage(null);
    try {
      await authService.createStaffInvite(data.email);
      setInviteMessage({
        variant: 'success',
        title: 'Invite sent',
        message: `We emailed ${data.email} a link to create their Event Staff account.`,
      });
      inviteForm.reset();
    } catch (error) {
      const feedback = getAuthFeedback(error);
      setInviteMessage({
        variant: feedback.variant,
        title: feedback.title,
        message: feedback.message,
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (member, action) => {
    setRoleActionId(`${action}-${member.id}`);
    setRoleMessage(null);
    try {
      const response = action === 'promote'
        ? await authService.promoteAdmin(member.email)
        : await authService.demoteAdmin(member.email);

      if (response?.data?.data?.id === user?.id) {
        updateUser(response.data.data);
      }

      setRoleMessage({
        variant: 'success',
        title: action === 'promote' ? 'User promoted' : 'User demoted',
        message: action === 'promote'
          ? `${member.name} is now an Admin.`
          : `${member.name} is now Event Staff.`,
      });
      await fetchTeam();
    } catch (error) {
      const feedback = getAuthFeedback(error);
      setRoleMessage({
        variant: feedback.variant,
        title: feedback.title,
        message: feedback.message,
      });
    } finally {
      setRoleActionId(null);
    }
  };

  const admins = team.members?.filter((m) => m.role === 'Admin') || [];
  const staff = team.members?.filter((m) => m.role === 'Event Staff') || [];

  const canDemote = (member) => {
    if (member.role !== 'Admin') return false;
    if (team.adminCount <= 1 && member.active && member.emailVerified) return false;
    return true;
  };

  const renderMemberRow = (member) => {
    const isSelf = member.id === user?.id;
    const isPromoting = roleActionId === `promote-${member.id}`;
    const isDemoting = roleActionId === `demote-${member.id}`;

    return (
      <tr key={member.id} className="hover:bg-stone-50/80">
        <td className="px-4 py-3.5">
          <p className="font-medium text-stone-900">
            {member.name}
            {isSelf ? <span className="ml-2 text-xs font-normal text-stone-500">(you)</span> : null}
          </p>
          <p className="text-xs text-stone-500 sm:hidden">{member.email}</p>
        </td>
        <td className="hidden px-4 py-3.5 text-stone-600 sm:table-cell">{member.email}</td>
        <td className="px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={member.role} />
            {!member.emailVerified && (
              <span className="status-chip bg-amber-50 text-amber-800">Unverified</span>
            )}
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-3.5 text-right">
          {member.role === 'Event Staff' ? (
            <button
              type="button"
              className="btn-secondary !min-h-0 !px-3 !py-1.5 text-xs"
              disabled={!!roleActionId}
              onClick={() => handleRoleChange(member, 'promote')}
            >
              {isPromoting ? 'Promoting…' : 'Promote'}
            </button>
          ) : (
            <button
              type="button"
              className="btn-ghost !px-3 !py-1.5 text-xs text-red-700 hover:bg-red-50 hover:text-red-800"
              disabled={!!roleActionId || !canDemote(member)}
              title={!canDemote(member) ? 'At least one Admin must remain' : undefined}
              onClick={() => handleRoleChange(member, 'demote')}
            >
              {isDemoting ? 'Demoting…' : 'Demote'}
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <DashboardLayout>
      <div className="page-form-wrap">
        <div className="mb-6">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Password and workspace access.</p>
        </div>

        <div className="form-shell">
          {!isAdmin && (
            <FormSection
              title="Event Staff access"
              description="You were invited to this workspace. Contact an admin if you need additional permissions."
            />
          )}

          {isAdmin && (
            <>
              <form onSubmit={inviteForm.handleSubmit(sendStaffInvite)}>
                <FormSection title="Invite event staff" description="Invite staff to use the scanner and help check in guests.">
                  {inviteMessage && (
                    <div className="mb-4">
                      <FormAlert variant={inviteMessage.variant} title={inviteMessage.title}>
                        {inviteMessage.message}
                      </FormAlert>
                    </div>
                  )}
                  <FormField label="Staff email" required>
                    <input
                      type="email"
                      className="input-field"
                      {...inviteForm.register('email', { required: true })}
                    />
                  </FormField>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={inviting}>
                      {inviting ? 'Sending…' : 'Send invite'}
                    </button>
                  </div>
                </FormSection>
              </form>

              <FormSection title="Team members" description="Admins manage events. Event Staff scan QR codes at the venue.">
                {roleMessage && (
                  <div className="mb-4">
                    <FormAlert variant={roleMessage.variant} title={roleMessage.title}>
                      {roleMessage.message}
                    </FormAlert>
                  </div>
                )}

                {teamLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Admins ({admins.length})
                      </h3>
                      <div className="table-shell !shadow-none">
                        <div className="table-scroll">
                          <table className="w-full text-left text-sm">
                            <thead className="border-b border-stone-200 bg-surface-muted">
                              <tr>
                                <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                                <th className="hidden px-4 py-3 font-medium text-stone-600 sm:table-cell">Email</th>
                                <th className="px-4 py-3 font-medium text-stone-600">Role</th>
                                <th className="px-4 py-3 font-medium text-stone-600" />
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {admins.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-stone-500">
                                    No admins yet.
                                  </td>
                                </tr>
                              ) : (
                                admins.map(renderMemberRow)
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Event Staff ({staff.length})
                      </h3>
                      <div className="table-shell !shadow-none">
                        <div className="table-scroll">
                          <table className="w-full text-left text-sm">
                            <thead className="border-b border-stone-200 bg-surface-muted">
                              <tr>
                                <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                                <th className="hidden px-4 py-3 font-medium text-stone-600 sm:table-cell">Email</th>
                                <th className="px-4 py-3 font-medium text-stone-600">Role</th>
                                <th className="px-4 py-3 font-medium text-stone-600" />
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {staff.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-stone-500">
                                    No event staff yet. Send an invite above.
                                  </td>
                                </tr>
                              ) : (
                                staff.map(renderMemberRow)
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </FormSection>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormSection title="Change password">
              <FormField label="Current password" required>
                <input type="password" className="input-field" {...register('currentPassword', { required: true })} />
              </FormField>
              <FormField label="New password" required hint="At least 8 characters.">
                <input
                  type="password"
                  className="input-field"
                  {...register('newPassword', { required: true, minLength: 8 })}
                />
              </FormField>
              <FormField label="Confirm new password" error={errors.confirmPassword?.message}>
                <input
                  type="password"
                  className={`input-field ${errors.confirmPassword ? 'input-field-error' : ''}`}
                  {...register('confirmPassword', {
                    validate: (v) => v === watch('newPassword') || 'Passwords do not match',
                  })}
                />
              </FormField>
            </FormSection>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
