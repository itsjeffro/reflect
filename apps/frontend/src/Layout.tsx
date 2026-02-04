import { Outlet, useNavigate } from "react-router"
import { useGetUser } from "./common/api/getUser";
import { useEffect } from "react";
import { useAuth } from "./common/context/auth/useAuth";
import { useTokenManager } from "./common/hooks/useTokenManager";

export const Layout = () => {
  const navigate = useNavigate();
  const { getToken } = useTokenManager();
  const { setUser, token, setToken } = useAuth();

  useEffect(() => {
    const loadToken = async () => {
      const storedToke = await getToken();
      setToken(storedToke);
    };

    loadToken();
  }, [getToken, setToken]);

  const { data: user, isLoading, error, isError } = useGetUser();

  useEffect(() => {
    if (user) {
      setUser({ name: user?.name, email: user?.email });
    }
  }, [user, setUser]);

  useEffect(() => {
    if (isError && Number(error.code) === 401) {
      navigate('/login')
    }
  }, [error, isError, token, navigate])

  if (isLoading) {
    return <>Loading...</>
  }

  return <Outlet />
};
