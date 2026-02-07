import { useEffect, useState, type FC, type ReactNode } from "react";
import { AuthContext, type UserType } from "./AuthContext";
import { useTokenManager } from "../../hooks/useTokenManager";

type AuthProviderType = {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderType> = ({ children }) => {
  const [user, setUser] = useState<UserType>({ email: null, name: null });
  const [token, setToken] = useState<string | null>(null);

  const { getToken } = useTokenManager();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = await getToken();

      if (storedToken) {
        setToken(await getToken());
      }
    }

    initAuth();
  }, [getToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
