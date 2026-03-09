/**
 * App Configuration
 *
 * Set the API URL via environment variable EXPO_PUBLIC_API_URL
 * before building for production.
 *
 * For local development on a physical device:
 *   Replace with your computer's LOCAL IP, e.g.: 'http://192.168.1.5:5000/api'
 *
 * For Android emulator: 'http://10.0.2.2:5000/api'
 * For iOS simulator: 'http://localhost:5000/api'
 *
 * For production: set EXPO_PUBLIC_API_URL=https://your-backend.com/api
 */
export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

