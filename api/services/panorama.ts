import api from "../client";
import { VTOUR_ENDPOINTS } from "../endpoint";

export const getUserProfile = async (userId: string) => {
  const response = await api.get(VTOUR_ENDPOINTS.VTOUR_BY_ID(userId));
  return response.data;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};