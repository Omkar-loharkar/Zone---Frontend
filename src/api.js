// Centralized API utility for JobPlatform
// Handles token management, error handling, and provides helper methods for all backend endpoints

const BASE_URL = 'http://localhost:8080/api';

function getToken(role) {
  if (role === 'hr') return localStorage.getItem('hrToken');
  if (role === 'candidate') return localStorage.getItem('candidateToken');
  return null;
}

async function apiFetch(endpoint, { method = 'GET', body, role, params, headers = {} } = {}) {
  let url = BASE_URL + endpoint;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += '?' + query;
  }
  const token = getToken(role);
  const fetchHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) fetchHeaders['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'API error');
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth
export const login = (role, email, password) =>
  apiFetch(`/${role}/auth/login`, { method: 'POST', body: { email, password } });
export const register = (role, data) =>
  apiFetch(`/${role}/auth/register`, { method: 'POST', body: data });
export const getProfile = (role) =>
  apiFetch(`/${role}/auth/profile`, { role });
export const updateProfile = (role, data) =>
  apiFetch(`/${role}/auth/profile`, { method: 'PUT', body: data, role });

// Jobs
export const getJobs = (role, filters) =>
  apiFetch(`/${role}/jobs/all`, { role, params: filters });
export const getMyJobs = () =>
  apiFetch('/hr/jobs/my', { role: 'hr' });
export const addJob = (data) =>
  apiFetch('/hr/jobs/add', { method: 'POST', body: data, role: 'hr' });

// Applications
export const applyToJob = (jobId) =>
  apiFetch('/apply', { method: 'POST', body: { jobId }, role: 'candidate' });
export const getCandidateApplications = () =>
  apiFetch('/candidate/applications', { role: 'candidate' });
export const getJobApplications = (jobId) =>
  apiFetch(`/hr/applications/${jobId}`, { role: 'hr' });
export const updateApplicationStatus = (applicationId, status) =>
  apiFetch(`/hr/applications/${applicationId}/status`, { method: 'POST', role: 'hr', params: { status } }); 