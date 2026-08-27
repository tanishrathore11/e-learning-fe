import api from './axios';
import { Lesson, CreateLessonPayload, UpdateLessonPayload } from '../types/lesson';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const createLesson = async (payload: CreateLessonPayload): Promise<Lesson> => {
  const { data } = await api.post<ApiResponse<Lesson>>('/lessons', payload);
  return data.data;
};

export const updateLesson = async (id: string, payload: UpdateLessonPayload): Promise<Lesson> => {
  const { data } = await api.patch<ApiResponse<Lesson>>(`/lessons/${id}`, payload);
  return data.data;
};

export const deleteLesson = async (id: string): Promise<void> => {
  await api.delete(`/lessons/${id}`);
};
