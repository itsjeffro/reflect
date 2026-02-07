import axios from 'axios';
import { useAuth } from '../context/auth/useAuth';
import { useMemo } from 'react';

export const useHttpClient = () => {
  const { token } = useAuth();

  const isElectron = !!window.store;

  // Used for external applications like Desktop.
  const tokenConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }), [token]);

  // Used when the API and Web SPA are using the same hostname.
  const sameHostnameConfig = useMemo(() => ({ 
    withCredentials: true, 
    withXSRFToken: true,
  }), []);

  const httpClient = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      ...(isElectron ? tokenConfig : sameHostnameConfig),
    });
  }, [isElectron, tokenConfig, sameHostnameConfig]);

  return {
    httpClient,
  };
};
