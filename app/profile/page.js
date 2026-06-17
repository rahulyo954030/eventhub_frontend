'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/helpers';
import FormField from '@/components/ui/FormField';
import UserAvatar from '@/components/ui/UserAvatar';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.updateProfile(data);
      updateUser(response.data.data);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please choose a JPG, PNG, WebP, or GIF image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller');
      return;
    }

    setUploading(true);
    try {
      const response = await authService.uploadAvatar(file);
      updateUser(response.data.data);
      toast.success('Profile photo updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.avatar) return;

    setRemoving(true);
    try {
      const response = await authService.removeAvatar();
      updateUser(response.data.data);
      toast.success('Profile photo removed');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-form-wrap">
        <div className="mb-6">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your name and account details.</p>
        </div>
        <div className="form-shell">
          <div className="form-section">
            <h2 className="form-section-title">Profile photo</h2>
            <p className="form-section-desc">Upload a photo from your device. Stored securely on Cloudinary.</p>

            <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <UserAvatar user={user} size="xl" />
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploading || removing}
                  onChange={handleAvatarSelect}
                />
                <button
                  type="button"
                  className="btn-primary w-full sm:w-auto"
                  disabled={uploading || removing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? 'Uploading…' : 'Upload photo'}
                </button>
                {user?.avatar && (
                  <button
                    type="button"
                    className="btn-secondary w-full sm:w-auto"
                    disabled={uploading || removing}
                    onClick={handleRemoveAvatar}
                  >
                    {removing ? 'Removing…' : 'Remove'}
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-faint">JPG, PNG, WebP or GIF · max 5 MB</p>

            <h2 className="form-section-title mt-8">Your details</h2>
            <form className="form-section-body mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FormField label="Name">
                <input className="input-field" {...register('name')} />
              </FormField>
              <FormField label="Email" hint="Contact support to change your email.">
                <input className="input-field bg-surface-muted" value={user?.email || ''} disabled />
              </FormField>
              <FormField label="Role">
                <input className="input-field bg-surface-muted" value={user?.role || ''} disabled />
              </FormField>
              <div className="form-actions !mx-[-1.5rem] !mb-[-1.25rem] !mt-2">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
