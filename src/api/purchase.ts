import api from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PurchaseItem {
  courseId: string;
}

export const purchaseCourse = async (courseId: string): Promise<void> => {
  const payload: { items: PurchaseItem[] } = { items: [{ courseId }] };
  await api.post('/purchases', payload);
};

export const getMyPurchases = async (): Promise<ApiResponse<unknown>> => {
  const { data } = await api.get<ApiResponse<unknown>>('/purchases/me');
  return data;
};
