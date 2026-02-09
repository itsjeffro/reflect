import { Outlet, useLocation, useNavigate } from "react-router"
import { useGetUser } from "./common/api/getUser";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./common/context/auth/useAuth";
import { useTokenManager } from "./common/hooks/useTokenManager";
import { Avatar, Flex, Tooltip } from "@radix-ui/themes";
import { Nav, NavMenu, NavMenuItem } from "./common/components/Nav";
import { type Icon } from "@tabler/icons-react";
import { initials } from "./common/utils/avatar";
import { UserPopover } from "./common/components/UserPropover";
import { NAV_ITEMS } from "./constants/nav.constants";

export const Layout = () => {
  const navigate = useNavigate();
  const { getToken } = useTokenManager();
  const { setUser, setToken } = useAuth();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { pathname } = useLocation();

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

  const renderIcon = useCallback((icon: Icon) => {
    const Component = icon;
    return <Component size="16px" />
  }, []);

  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <Flex direction="row" height="100%" display="flex">
      <Nav>
        <NavMenu>
          {NAV_ITEMS.map((navItem) => (
            <Tooltip content={navItem.label} side="right">
              <NavMenuItem
                onClick={() => navigate(navItem.path, { viewTransition: true })} 
                active={pathname === navItem.path}
                >
                  {renderIcon(navItem.icon)}
                </NavMenuItem>
            </Tooltip>
          ))}
        </NavMenu>

        <UserPopover user={user!}>
          <Avatar role="button" size="2" color="blue" fallback={initials(user?.name) ?? ''} radius="full" />
        </UserPopover>
      </Nav>
      <Outlet />
    </Flex>
  )
};
