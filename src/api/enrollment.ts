import api from './axios';
import { Enrollment } from '../types/enrollment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getEnrolledCourses = async (): Promise<Enrollment[]> => {
  const { data } = await api.get<ApiResponse<Enrollment[]>>('/enrollments/me');
  return data.data;
};
