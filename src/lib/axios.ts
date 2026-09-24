import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling and normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // If request was canceled by AbortController, propagate cancellation
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Backend returned an error response (4xx, 5xx)
      const data = error.response.data;
      if (data && typeof data === 'object' && 'message' in data && data.message) {
        errorMessage = data.message;
      } else if (error.response.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.response.status === 401) {
        errorMessage = 'Session expired or invalid credentials. Please log in again.';
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = `/login?from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      // Network error (no response received)
      errorMessage = 'Network connection lost. Please check your internet connection.';
    }

    // Attach human-readable normalized message onto error object
    const enhancedError = new Error(errorMessage);
    (enhancedError as unknown as { originalError: AxiosError }).originalError = error;
    (enhancedError as unknown as { status?: number }).status = error.response?.status;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
