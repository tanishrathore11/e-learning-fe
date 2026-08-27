import api from './axios';
import { AdminDashboardData, InstructorDashboardData, MarkProgressPayload, StudentDashboardItem } from '../types/dashboard';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getInstructorDashboard = async (): Promise<InstructorDashboardData> => {
  const { data } = await api.get<ApiResponse<InstructorDashboardData>>('/dashboard/instructor');
  return data.data;
};

export const getStudentDashboard = async (): Promise<StudentDashboardItem[]> => {
  const { data } = await api.get<ApiResponse<StudentDashboardItem[]>>('/dashboard/student');
  return data.data;
};

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const { data } = await api.get<ApiResponse<AdminDashboardData>>('/dashboard/admin');
  return data.data;
};

export const markLessonComplete = async (payload: MarkProgressPayload): Promise<void> => {
  await api.post('/dashboard/progress', payload);
};

export const unmarkLessonComplete = async (payload: MarkProgressPayload): Promise<void> => {
  await api.delete('/dashboard/progress', { data: payload });
};
