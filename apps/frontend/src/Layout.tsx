import { Outlet, useNavigate } from "react-router"
import { useGetUser } from "./common/api/getUser";
import { useEffect, useState } from "react";
import { useAuth } from "./common/context/auth/useAuth";
import { useTokenManager } from "./common/hooks/useTokenManager";
import { Avatar, Flex, Tooltip } from "@radix-ui/themes";
import { Nav, NavMenu, NavMenuItem } from "./common/components/Nav";
import { IconHome, IconStar } from "@tabler/icons-react";
import { initials } from "./common/utils/avatar";

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

  return (
    <Flex direction="row" height="100%" display="flex">
      <Nav>
        <NavMenu>
          <Tooltip content="Home" side="right">
            <NavMenuItem active onClick={() => navigate('/', { viewTransition: true })}><IconHome size="16px" /></NavMenuItem>
          </Tooltip>
          <Tooltip content="Pinned" side="right">
            <NavMenuItem><IconStar size="16px" /></NavMenuItem>
          </Tooltip>
        </NavMenu>
        <Avatar size="2" color="blue" fallback={initials(user?.name) ?? ''} radius="full" />
      </Nav>
      <Outlet />
    </Flex>
  )
};
