import styled from "@emotion/styled";

export const EditorOptions = styled.div({
  padding: '1rem 0',
  margin: '0 1rem',
  display: 'flex',
  gap: '0.5rem',
});

export const EditorOption = styled.button({
  background: 'var(--btn-secondary)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.25rem',
  padding: '.4rem .65rem',
  borderRadius: '7px',
  border: 0,
  color: 'inherit',
  cursor: 'pointer',
  '&:hover': {
    background: 'var(--btn-secondary-hover)'
  }
});