import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { type Option } from '.';

type SingleOptionProps = {
  children: ReactNode;
  selected: Option[] | undefined;
  placeholder: string | undefined;
  disabled: boolean;
  input: string;
};

export const SingleOption = ({ children, selected, input, placeholder, disabled }: SingleOptionProps) => {
  return (
    <InputContainer>
      {!input && (
        <InputText>
          {selected?.map((option) => (
            <span key={option.value}>{option.label}</span>
          ))}
        </InputText>
      )}

      {!selected && !input && (
        <InputText style={{ color: disabled ? 'rgba(0,0,0,.40)' : 'var(--bg-content-subtle)', }}>
          {placeholder && placeholder}
        </InputText>
      )}

      {children}
    </InputContainer>
  )
};

const InputContainer = styled.div({
  alignItems: 'center',
  display: 'grid',
  flex: '1 1 0%',
  flexWrap: 'wrap',
  position: 'relative',
  overflow: 'hidden',
  padding: '2px 6px',
  boxSizing: 'border-box',
});

const InputText = styled.div({
  gridArea: '1 / 1 / 2 / 3',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  margin: '0 2px',
  fontSize: '0.875rem',
  fontFamily: 'arial',
});
