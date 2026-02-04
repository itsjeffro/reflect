import axios from 'axios';
import { useAuth } from '../context/auth/useAuth';
import { useMemo } from 'react';

export const useHttpClient = () => {
  const { token } = useAuth();

  const httpClient = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }, [token]);

  return {
    httpClient,
  };
};
