import apiClient from './axios';

const BASE_PATH = "/user-roles";

export const getRoles = async (filters) => {
  const { data } = await apiClient.get(`${BASE_PATH}/`, { params: filters });
  return data;
};