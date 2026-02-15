import styled from "@emotion/styled"
import type { ReactNode } from "react";
import { type Option } from '.';

type MultiOptionProps = {
  onRemoveClick: (option: Option) => void;
  selected: Option[] | undefined;
  children: ReactNode;
}

export const MultiOption = ({ children, onRemoveClick, selected }: MultiOptionProps) => {
  return (
    <>
      <Tags>
        {selected?.map((option) => (
          <Tag key={option.value}>
            {option.label}
            <RemoveButton onClick={() => onRemoveClick(option)}>x</RemoveButton>
          </Tag>
        ))}
      </Tags>

      {children}
    </>
  )
}

const Tags = styled.div({
  display: 'flex',
  gap: '.25rem',
  padding: '0 0.5rem 0 0',
  fontSize: '0.875rem',
  fontFamily: 'arial',
})

const Tag = styled.div({
  display: 'inline-flex',
  flexGrow: 0,
  alignItems: 'center',
  border: `1px solid var(--border)`,
  borderRadius: '4px',
  fontSize: '0.875rem',
  background: '#fff',
  padding: '0 0 0 0.5rem'
});

const RemoveButton = styled.button({
  background: 'transparent',
  border: 0,
  padding: '0 0.5rem',
  alignItems: 'center',
  display: 'inline-flex',
})