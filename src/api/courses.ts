import api from './axios';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../types/course';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getCourses = async (topicId?: string): Promise<Course[]> => {
  const url = topicId ? `/courses?topicId=${topicId}` : '/courses';
  const { data } = await api.get<ApiResponse<Course[]>>(url);
  return data.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const { data } = await api.get<ApiResponse<Course>>(`/courses/${id}`);
  return data.data;
};

export const createCourse = async (payload: CreateCoursePayload): Promise<Course> => {
  const { data } = await api.post<ApiResponse<Course>>('/courses', payload);
  return data.data;
};

export const updateCourse = async (id: string, payload: UpdateCoursePayload): Promise<Course> => {
  const { data } = await api.patch<ApiResponse<Course>>(`/courses/${id}`, payload);
  return data.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`/courses/${id}`);
};
