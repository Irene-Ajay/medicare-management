export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}
