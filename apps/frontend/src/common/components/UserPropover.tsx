import { Button, Flex, Popover, Separator, Text } from "@radix-ui/themes";
import { useCallback, type ReactNode } from "react";
import type { UserModel } from "../api/types/user.types";
import { useAuthLogout } from "../api/authLogout";
import { useNavigate } from "react-router";
import styled from "@emotion/styled";

type UserPopoverProps = {
  children: ReactNode;
  user: UserModel;
}
export const UserPopover = ({ children, user }: UserPopoverProps) => {
  const navigate = useNavigate();

  const {mutate: logout } = useAuthLogout({
    onSuccess: () => navigate('/login'),
    onError: (error) => alert(JSON.stringify(error)),
  });

  const handleLogoutClick = useCallback(() => {
    logout();
  }, [logout]);

  return (
  <Popover.Root>
    <Popover.Trigger>
      <Button style={{ padding: 0, background: 'none', border: 0 }}>
      {children}
      </Button>
    </Popover.Trigger>
    <Popover.Content side="right" width="300px">
      <Flex direction="column" gap="2">
        <Text size="2">{user?.name}</Text>

        <Separator style={{ width: '100%' }} />

        <ListButton onClick={handleLogoutClick}>Logout</ListButton>
      </Flex>
    </Popover.Content>
  </Popover.Root>
  )
}

const ListButton = styled.button({
  background: 'none',
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
  border: 0,
  padding: 0,
  textAlign: 'left',
})