import styled from "@emotion/styled";
import { IconButton } from "@radix-ui/themes";

type NavMenuItemProps = {
  active?: boolean;
};

export const NavMenuItem = styled(IconButton)<NavMenuItemProps>(({ active }) => ({
  background: 'none', 
  color: '#666',
  cursor: 'pointer',
  '&:hover': {
    background: '#f7f7f7',
  },
  ...(active && ({
    background: 'var(--bg-primary)',
    color: '#fff',
    '&:hover': {
      background: '#028af1',
    },
  }))
}));
