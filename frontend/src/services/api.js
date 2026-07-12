import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Members
export const getMembers = () => api.get('/members');
export const getMemberBySlug = (slug) => api.get(`/members/${slug}`);
export const getAllMembersAdmin = () => api.get('/members/admin/all');
export const createMember = (data) => api.post('/members/admin/create', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateMember = (id, data) => api.put(`/members/admin/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMember = (id) => api.delete(`/members/admin/${id}`);

// Projects
export const getProjects = (params) => api.get('/projects', { params });
export const getProjectBySlug = (slug) => api.get(`/projects/${slug}`);
export const getDashboardStats = () => api.get('/projects/admin/stats');
export const createProject = (data) => api.post('/projects/admin/create', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProject = (id, data) => api.put(`/projects/admin/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProject = (id) => api.delete(`/projects/admin/${id}`);

// Skills
export const getSkills = () => api.get('/skills');
export const createSkill = (data) => api.post('/skills/admin/create', data);
export const updateSkill = (id, data) => api.put(`/skills/admin/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/admin/${id}`);

// Achievements
export const getAchievements = (params) => api.get('/achievements', { params });
export const createAchievement = (data) => api.post('/achievements/admin/create', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAchievement = (id, data) => api.put(`/achievements/admin/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAchievement = (id) => api.delete(`/achievements/admin/${id}`);

// Contact
export const submitContact = (data) => api.post('/contact', data);
export const getMessages = (params) => api.get('/contact/admin/messages', { params });
export const updateMessageStatus = (id, status) => api.put(`/contact/admin/${id}`, { status });
export const deleteMessage = (id) => api.delete(`/contact/admin/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings/admin/update', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// Auth
export const loginAdmin = (email, password) => api.post('/auth/login', { email, password });
export const getAdminProfile = () => api.get('/auth/me');
export const updateAdminProfile = (data) => api.put('/auth/profile', data);

export default api;
