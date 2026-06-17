'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FormField from '@/components/ui/FormField';
import FormSection from '@/components/ui/FormSection';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/helpers';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

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

  const claimAdmin = async () => {
    setClaiming(true);
    try {
      const response = await authService.claimAdmin();
      updateUser(response.data.data);
      toast.success('You are now Admin');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setClaiming(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-form-wrap">
        <div className="mb-6">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Password and workspace access.</p>
        </div>

        <div className="form-shell">
        {user?.role !== 'Admin' && (
          <FormSection title="Admin access" description="Only needed if no admin exists yet.">
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={claimAdmin}
              disabled={claiming}
            >
              {claiming ? 'Claiming…' : 'Claim admin role'}
            </button>
          </FormSection>
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
