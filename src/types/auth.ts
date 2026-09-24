export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse extends User {
  accessToken?: string;
  token?: string; // backward compatibility with older DummyJSON
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
