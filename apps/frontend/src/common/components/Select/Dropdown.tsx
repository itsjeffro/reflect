import styled from "@emotion/styled";

export const Dropdown = styled.div({
  background: '#fff',
  boxShadow: '0 3px 8px rgba(0,0,0,.20)',
  borderRadius: '4px',
  alignItems: 'center',
  padding: '.25rem 0',
  maxHeight: '300px',
  overflowY: 'auto',
  zIndex: 1,
});

export const DropdownOption = styled.div<{ selected?: boolean }>(({ selected }) => ({
  padding: '.5rem',
  fontSize: '0.875rem',
  fontFamily: 'arial',
  ...(selected && {
    background: 'rgba(0,0,0,.02)',
  }),
  '&:hover, &.focused': {
    background: selected ? 'rgba(0,0,0,.04)' : 'rgba(0,0,0,.02)',
    cursor: 'pointer',
  },
}))