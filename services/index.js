import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/auth/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removeAvatar: () => api.delete('/auth/profile/avatar'),
  validateSession: () => api.get('/auth/validate'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  clearSession: () => api.post('/auth/clear-session'),
  claimAdmin: () => api.post('/auth/claim-admin'),
  promoteAdmin: (email) => api.post('/auth/promote-admin', { email }),
  demoteAdmin: (email) => api.post('/auth/demote-admin', { email }),
  getTeamMembers: () => api.get('/auth/team-members'),
  createStaffInvite: (email) => api.post('/auth/staff-invites', { email }),
  listStaffInvites: () => api.get('/auth/staff-invites'),
};

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  archive: (id) => api.patch(`/events/${id}/archive`),
  publish: (id) => api.patch(`/events/${id}/publish`),
};

export const attendeeService = {
  getAll: (eventId, params) => api.get(`/events/${eventId}/attendees`, { params }),
  getById: (id) => api.get(`/attendees/${id}`),
  create: (eventId, data) => api.post(`/events/${eventId}/attendees`, data),
  update: (id, data) => api.put(`/attendees/${id}`, data),
  delete: (id) => api.delete(`/attendees/${id}`),
  sendInvitation: (id) => api.post(`/attendees/${id}/send-invitation`),
  sendBulkInvitations: (eventId) => api.post(`/events/${eventId}/attendees/send-invitations`),
  sendBulkReminders: (eventId) => api.post(`/events/${eventId}/attendees/send-reminders`),
  sendBulkThankYou: (eventId) => api.post(`/events/${eventId}/attendees/send-thank-you`),
  bulkUpload: (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/events/${eventId}/attendees/bulk-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const registrationService = {
  getByToken: (token) => api.get(`/register/${token}`),
  confirm: (token, data) => api.post(`/register/${token}/confirm`, data),
  cancel: (token) => api.post(`/register/${token}/cancel`),
};

export const checkinService = {
  checkIn: (qrData) => api.post('/checkin', { qrData }),
};

export const dashboardService = {
  getData: () => api.get('/dashboard'),
};

export const reportService = {
  getReport: (type, params) => api.get(`/reports/${type}`, { params }),
  downloadReport: (type, params) =>
    api.get(`/reports/${type}`, {
      params: { ...params, format: params.format || 'csv' },
      responseType: 'blob',
    }),
};
