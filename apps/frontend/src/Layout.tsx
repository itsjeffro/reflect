import { Outlet, useNavigate } from "react-router"
import { useGetUser } from "./common/api/getUser";
import { useEffect, useState } from "react";
import { useAuth } from "./common/context/auth/useAuth";
import { useTokenManager } from "./common/hooks/useTokenManager";

export const Layout = () => {
  const navigate = useNavigate();
  const { getToken } = useTokenManager();
  const { setUser, setToken } = useAuth();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const { data: user, isLoading, error, isError } = useGetUser({
    enabled: !isLoadingAuth,
  });

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getToken();

      setIsLoadingAuth(false);
      setToken(storedToken);
    };

    loadToken();
  }, [getToken, setToken]);

  useEffect(() => {
    if (user) {
      setUser({ name: user?.name, email: user?.email });
    }

    const isUnauthorized = isError && Number(error.code) === 401;

    if (!isLoadingAuth && isUnauthorized) {
      navigate('/login');
    }
  }, [error, isError, isLoadingAuth, isLoading, navigate, setUser, user]);

  if (isLoading) {
    return <>Loading...</>
  }

  return <Outlet />
};
