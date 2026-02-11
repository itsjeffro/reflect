import styled from "@emotion/styled";
import { IconButton } from "@radix-ui/themes";

type NavMenuItemProps = {
  selected?: boolean;
};

export const NavMenuItem = styled(IconButton)<NavMenuItemProps>(({ selected }) => ({
  background: 'none', 
  color: '#666',
  cursor: 'pointer',
  '&:hover': {
    background: '#f7f7f7',
  },
  ...(selected && ({
    background: 'var(--bg-primary)',
    color: '#fff',
    '&:hover': {
      background: '#028af1',
    },
  }))
}));

export const Nav = styled.nav({
  borderRight: '1px solid var(--border)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  flexGrow: 0,
});

export const NavMenu = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})