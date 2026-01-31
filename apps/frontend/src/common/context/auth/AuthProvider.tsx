import { useState, type FC, type ReactNode } from "react";
import { AuthContext, type UserType } from "./AuthContext";
import { getTokenFromCookie } from "../../utils/cookie";

type AuthProviderType = {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderType> = ({ children }) => {
  const [user, setUser] = useState<UserType>({ email: null, name: null });
  const [token, setToken] = useState<string | null>(null);

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
