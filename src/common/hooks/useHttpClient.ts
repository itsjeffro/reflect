import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookie';

export const useHttpClient = () => {
  const token = getTokenFromCookie();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    ...config,
  });

  return {
    httpClient,
  };
};
