import { Outlet, useNavigate } from "react-router"
import { useGetUser } from "./common/api/getUser";
import { useEffect } from "react";
import { useAuth } from "./common/context/auth/useAuth";

export const Layout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

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
  }, [error, isError, navigate])

  if (isLoading) {
    return <>Loading...</>
  }

  return <Outlet />
};
