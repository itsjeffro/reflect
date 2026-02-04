import { useCallback } from "react";
import { useAuth } from "../context/auth/useAuth";

export const useTokenManager = () => {
  const { token, setToken } = useAuth();

  const storeToken = useCallback(async (token: string) => {
    if (window?.store) {
      await window.store.set('token', token);
    }

    setToken(token);
  }, [setToken])

  const getToken = useCallback(async () => {
    if (window?.store) {
      return await window.store.get('token');
    }

    return token;
  }, [token])

  return {
    getToken,
    storeToken,
  }
};
