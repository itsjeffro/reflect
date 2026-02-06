import { useCallback } from "react";
import { useHttpClient } from "./useHttpClient";
import { useTokenManager } from "./useTokenManager";

type LoginRequest = {
  email?: string | null,
  password?: string | null,
  remember: boolean,
};

type Error = {
  data: {
    errors: {
      email: string;
      password: string;
    }
  }
};

type UseLogin = {
  onSuccess: () => void;
  onError: (errors: Error) => void
};

export const useLogin = ({ onSuccess, onError }: UseLogin) => {
  const { httpClient } = useHttpClient();
  const { storeToken } = useTokenManager();

  const handleTokenLogin = useCallback(async (data: LoginRequest) => {
    await httpClient
      .post('/sanctum/token', {
        ...data,
        device_name: window.store ? 'electron' : 'web',
      })
      .then(async (response) => {
        await storeToken(response.data);
        onSuccess();
      })
      .catch((errors) => onError(errors.response))
  }, [httpClient, onError, onSuccess, storeToken]);

  const handleSameSiteLogin = useCallback(async (data: LoginRequest) => {
    await httpClient.get('/sanctum/csrf-cookie');

    httpClient
      .post('/login', data)
      .then(async () => onSuccess())
      .catch((errors) => onError(errors))
  }, [httpClient, onSuccess, onError]);

  const handleLogin = useCallback((data: LoginRequest) => {
    if (!window.store) {
      handleSameSiteLogin(data);
    } else {
      handleTokenLogin(data);
    }
  }, [handleTokenLogin, handleSameSiteLogin]);

  return {
    handleLogin,
  }
};
