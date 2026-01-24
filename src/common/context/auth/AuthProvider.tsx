import { useSystemColorScheme } from "@/app/_common/hooks/useSystemColorScheme";
import { useState, type FC, type ReactNode } from "react";
import { AuthContext, type UserType } from "./AuthContext";
import { getTokenFromCookie } from "@/app/_common/lib/cookie";

type AuthProviderType = {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderType> = ({ children }) => {
  const [user, setUser] = useState<UserType>({ email: null, name: null });
  const [token, setToken] = useState<string | null>(null);

  useSystemColorScheme();

  const cookieToken = getTokenFromCookie();

  if (!token && cookieToken) {
    setToken(cookieToken);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
