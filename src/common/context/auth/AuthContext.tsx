import { createContext } from "react";

export type UserType = {
  email: string | null;
  name: string | null;
}

type AuthContextType = {
  user: UserType,
  setUser: (user: UserType) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export const initialState: UserType = {
  email: null,
  name: null,
};

export const AuthContext = createContext<AuthContextType>({
  user: initialState,
  setUser: (user) => { console.log(user) },
  token: null,
  setToken: (token) => { console.log(token) },
});
