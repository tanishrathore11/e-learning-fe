import api from './axios';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const getUserProfile = async (): Promise<User> => {
  const { data } = await api.get<ApiResponse<User>>('/users/me');
  return data.data;
};

export const updateUserProfile = async (payload: { name: string; bio: string | null }): Promise<User> => {
  const { data } = await api.patch<ApiResponse<User>>('/users/me', payload);
  return data.data;
};

export const registerInstructor = async (payload: RegisterPayload): Promise<{ success: boolean; data: { success: boolean; message: string } }> => {
  const { data } = await api.post<{ success: boolean; data: { success: boolean; message: string } }>('/auth/instructor/register', payload);
  return data;
};

export const approveInstructor = async (token: string): Promise<ApiResponse<User>> => {
  const { data } = await api.post<ApiResponse<User>>('/admin/instructors/approve', { token });
  return data;
};

export const getPendingInstructors = async (): Promise<User[]> => {
  const { data } = await api.get<ApiResponse<User[]>>('/admin/instructors/pending');
  return data.data;
};

export const approveInstructorById = async (id: string): Promise<ApiResponse<User>> => {
  const { data } = await api.patch<ApiResponse<User>>(`/admin/instructors/${id}/approve`);
  return data;
};

export const rejectInstructorById = async (id: string): Promise<ApiResponse<User>> => {
  const { data } = await api.patch<ApiResponse<User>>(`/admin/instructors/${id}/reject`);
  return data;
};
