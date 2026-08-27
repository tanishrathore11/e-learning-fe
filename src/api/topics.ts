import api from './axios';
import { Topic, CreateTopicPayload } from '../types/topic';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getTopics = async (): Promise<Topic[]> => {
  const { data } = await api.get<ApiResponse<Topic[]>>('/topics');
  return data.data;
};

export const createTopic = async (payload: CreateTopicPayload): Promise<Topic> => {
  const { data } = await api.post<ApiResponse<Topic>>('/topics', payload);
  return data.data;
};
