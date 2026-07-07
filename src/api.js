import { getToken, clearAuth } from './auth.js'

/**
 * API client for Jashom backend. Base URL from env.
 * Sends Authorization: Bearer <token> for admin blog routes.
 */
const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL
  if (!url) {
    console.warn('VITE_API_URL is not set. Using http://localhost:5000 as fallback.')
    return 'http://localhost:5000'
  }
  return url.replace(/\/$/, '')
}

const api = (path, options = {}) => {
  const base = getBaseUrl()
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  return fetch(url, { ...options, headers }).then((r) => {
    if (r.status === 401 && !path.includes('/auth/login')) {
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(new Error('Session expired'))
    }
    return r
  })
}

/** POST /v1/admin/auth/login — returns { token, admin } */
export const login = (email, password) =>
  api('/v1/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }).then((r) => {
    if (!r.ok) return r.json().then((b) => { throw new Error(b.error || r.statusText) })
    return r.json()
  })

export const getBlogs = (params = {}) => {
  const q = new URLSearchParams()
  if (params.status) q.set('status', params.status)
  if (params.slug) q.set('slug', params.slug)
  if (params.limit != null) q.set('limit', params.limit)
  if (params.offset != null) q.set('offset', params.offset)
  const query = q.toString()
  return api(`/v1/admin/blogs${query ? `?${query}` : ''}`).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to fetch blogs')
    return r.json()
  })
}

export const getBlog = (id) =>
  api(`/v1/admin/blogs/${id}`).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to fetch blog')
    return r.json()
  })

export const createBlog = (data) =>
  api('/v1/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((r) => {
    if (!r.ok) return r.json().then((b) => { throw new Error(b.error || r.statusText) })
    return r.json()
  })

export const updateBlog = (id, data) =>
  api(`/v1/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }).then((r) => {
    if (!r.ok) return r.json().then((b) => { throw new Error(b.error || r.statusText) })
    return r.json()
  })

export const deleteBlog = (id) =>
  api(`/v1/admin/blogs/${id}`, { method: 'DELETE' }).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to delete blog')
  })

// ── Jobs ────────────────────────────────────────────────────────────────────

export const getJobs = (params = {}) => {
  const q = new URLSearchParams()
  if (params.status) q.set('status', params.status)
  if (params.limit != null) q.set('limit', params.limit)
  if (params.offset != null) q.set('offset', params.offset)
  const query = q.toString()
  return api(`/v1/admin/jobs${query ? `?${query}` : ''}`).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to fetch jobs')
    return r.json()
  })
}

export const getJob = (id) =>
  api(`/v1/admin/jobs/${id}`).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to fetch job')
    return r.json()
  })

export const createJob = (data) =>
  api('/v1/admin/jobs', { method: 'POST', body: JSON.stringify(data) }).then((r) => {
    if (!r.ok) return r.json().then((b) => { throw new Error(b.error || r.statusText) })
    return r.json()
  })

export const updateJob = (id, data) =>
  api(`/v1/admin/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then((r) => {
    if (!r.ok) return r.json().then((b) => { throw new Error(b.error || r.statusText) })
    return r.json()
  })

export const deleteJob = (id) =>
  api(`/v1/admin/jobs/${id}`, { method: 'DELETE' }).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to delete job')
  })

// ── Applications ─────────────────────────────────────────────────────────────

export const getApplications = (params = {}) => {
  const q = new URLSearchParams()
  if (params.job_id) q.set('job_id', params.job_id)
  if (params.status) q.set('status', params.status)
  if (params.limit != null) q.set('limit', params.limit)
  const query = q.toString()
  return api(`/v1/applications${query ? `?${query}` : ''}`).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to fetch applications')
    return r.json()
  })
}

export const updateApplicationStatus = (id, status) =>
  api(`/v1/applications/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }).then((r) => {
    if (!r.ok) return r.json().then((b) => { throw new Error(b.error || r.statusText) })
    return r.json()
  })

export const deleteApplication = (id) =>
  api(`/v1/applications/${id}`, { method: 'DELETE' }).then((r) => {
    if (!r.ok) throw new Error(r.statusText || 'Failed to delete application')
  })
