import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('user_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const userService = {
    sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
    verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
    createRequest: (data) => api.post('/requests/create', data),
    getMyRequests: () => api.get('/requests/my-requests'),
    getProfile: () => api.get('/user/profile'),
    registerPushToken: (token) => api.post('/user/push-token', { token }),
};

export default api;
