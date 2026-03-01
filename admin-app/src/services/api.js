import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const adminService = {
    getRequests: () => api.get('/admin/requests'),
    exportRequests: () => api.get('/admin/requests/export', { responseType: 'blob' }),
    getAnalytics: () => api.get('/admin/analytics'),
    getDetailedAnalytics: () => api.get('/admin/analytics/detailed'),
    assignStaff: (requestId, data) => api.patch(`/admin/requests/${requestId}/assign`, data),
    updateStatus: (requestId, status) => api.patch(`/admin/requests/${requestId}/status`, { status }),
    getStaff: () => api.get('/admin/staff'),
    addStaff: (data) => api.post('/admin/staff', data),
};

export default api;
