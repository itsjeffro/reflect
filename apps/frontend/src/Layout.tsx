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

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getToken();

      setIsLoadingAuth(false);
      setToken(storedToken);
    };

    loadToken();
  }, [getToken, setToken]);

  const { data: user, isLoading, error, isError } = useGetUser({
    enabled: !isLoadingAuth,
  });

  useEffect(() => {
    if (user) {
      setUser({ name: user?.name, email: user?.email });
    }
  }, [user, setUser]);

  useEffect(() => {
    if (!isLoadingAuth && isError && Number(error.code) === 401) {
      navigate('/login')
    }
  }, [error, isError, isLoadingAuth, isLoading, navigate]);

  if (isLoading) {
    return <>Loading...</>
  }

  return <Outlet />
};
