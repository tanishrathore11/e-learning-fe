export type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  bio?: string | null;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
  bio?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
