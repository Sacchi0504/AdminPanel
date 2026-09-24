import apiClient from '@/lib/axios';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';

/**
 * Authenticates user credentials with DummyJSON
 * Endpoint: POST /auth/login
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    username: credentials.username.trim(),
    password: credentials.password,
    expiresInMins: credentials.expiresInMins || 60,
  });
  return response.data;
}

/**
 * Retrieves the currently authenticated user's profile
 * Endpoint: GET /auth/me
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}
