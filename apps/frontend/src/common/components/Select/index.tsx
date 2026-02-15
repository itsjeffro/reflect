import { useFloating, autoUpdate, offset, flip } from '@floating-ui/react';
import { type ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { IconChevronDown } from "@tabler/icons-react";
import { mergeRefs } from '../../utils';
import { Portal } from '@radix-ui/themes';

interface SelectProps {
  options?: Record<string, string>[];
  disabled?: boolean;
  value?: Record<string, string>[];
  placeholder?: string;
  onInputChange?: (value: string) => void;
  onChange?: (value: Record<string, string>[]) => void;
  multiselect?: boolean;
  container?: Element | DocumentFragment | null;
}

export const Select = forwardRef((
  { value, container, placeholder, onInputChange, onChange, options = [], disabled = false }: SelectProps
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<Record<string, string>[] | undefined>(value);
  const [reference, setReference] = useState<HTMLDivElement | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const focusedOptionRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    const inputValue = input?.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(inputValue))
  }, [options, input]);

  const selectedOptions = useMemo(() => {
    return selected?.flatMap((option) => option.value);
  }, [selected])

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
    ],
    elements: {
      reference,
    },
  });

  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsOpen(true);
  }, [setIsOpen, disabled]);

  /**
   * handles opening dropdown list when typing.
   */
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    if (onInputChange) {
      onInputChange(event.target.value);
    }

    if (!isOpen && event.target.value !== '') {
      setIsOpen(true);
    }
  };

  /**
   * Handle closing dropdown list when clicking outside the dropdown.
   */
  const onDocumentClickEvent = useCallback(
    (event: MouseEvent) => {
      if (!reference || disabled) {
        return;
      }

      const insideElement: boolean = reference.contains(event.target as Node);

      if (!insideElement) {
        setIsOpen(false);
        setInput('');
      }
    },
    [reference, disabled],
  );

  /**
   * Handle selecting option and resetting other states.
   */
  const handleOptionSelect = useCallback((option: Record<string, string>) => {
    if (onChange) {
      onChange([option]);
      console.log(option);
    }

    setIsOpen(false);
    setSelected([option]);
    setInput('');
  }, [onChange]);

  const handleKeyDownPress = useCallback((event: KeyboardEvent) => {
    // Should open on key UP/DOWN if focused dropdown is closed.
    if (!isOpen && inputRef.current === document.activeElement && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      setIsOpen(true);
    }

    // Should close on key TAB/ESC when focused dropdown is opened.
    if (isOpen && inputRef.current === document.activeElement && (event.key === 'Escape' || event.key === 'Tab')) {
      setIsOpen(false);
    }

    if (!isOpen) {
      return;
    }

    if (event.key === 'Enter') {
      const value = focusedOptionRef?.current?.getAttribute('data-value');
      const matchingOption = options.find(option => option.value === value);

      if (!matchingOption) {
        return;
      }

      setSelected([matchingOption]);
      setIsOpen(false);
      setInput('');
      return;
    }

    // First, we'll find a focused option (if any), get its index which is the position within the dropdown options.
    const selectedOption = listRef.current?.querySelector('&>div.focused');
    const currentActiveIndex = [...filteredOptions].findIndex((option) => option.value === selectedOption?.getAttribute('data-value'));

    // Clear out focused class from visible options.
    const optionElements = listRef.current?.querySelectorAll('&>div');

    optionElements?.forEach((option) => {
      option.classList.remove('focused');
    })

    // Determine the new focused option.
    let newIndex = currentActiveIndex < 0 ? -1 : currentActiveIndex;

    const optionsLength = filteredOptions.length - 1;

    if (event.key === 'ArrowUp') {
      newIndex = (newIndex - 1) < 0 ? optionsLength : (newIndex - 1);
    } else if (event.key === 'ArrowDown') {
      newIndex = (newIndex + 1) > optionsLength ? 0 : (newIndex + 1);
    }

    // Apply focused class to option based on newIndex.
    // console.log(currentActiveIndex, newIndex, optionElements);
    focusedOptionRef.current = optionElements?.[newIndex] as HTMLDivElement;
    focusedOptionRef.current.classList.add('focused')

    optionElements?.[newIndex].scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }, [isOpen, options, filteredOptions])

  useEffect(() => {
    if (isOpen) {
      const selectedOption = listRef.current?.querySelector('&>div[aria-selected="true"]');

      if (selectedOption) {
        selectedOption.classList.add('focused');
        selectedOption.scrollIntoView({ behavior: 'auto', block: 'nearest' })
      }
    }

    window.addEventListener('keydown', handleKeyDownPress);
    window.addEventListener('click', onDocumentClickEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDownPress);
      window.removeEventListener('click', onDocumentClickEvent);
    };
  }, [handleKeyDownPress, isOpen, onDocumentClickEvent]);

  useEffect(() => {
    if (value) {
      // setSelected(value);
    }
  }, [value]);

  return (
    <>
      <BaseAutocomplete
        ref={setReference}
        onClick={handleClick}
        aria-expanded={isOpen}
        role="combobox"
        tabIndex={0}
        onFocus={() => inputRef.current?.focus()}
      >
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
          <Input ref={inputRef} disabled={disabled} value={input} onChange={handleInputChange} />
        </InputContainer>
        <Close disabled={disabled} opened={isOpen}>
          <IconChevronDown size={14} />
        </Close>
      </BaseAutocomplete>

      <Portal {...(!!container && { container })}>
        {isOpen && (
          <Dropdown
            ref={mergeRefs([refs.setFloating, listRef])}
            style={{ ...floatingStyles, width: reference?.getBoundingClientRect().width }}
          >
            {filteredOptions.map((option) => (
              <DropdownOption
                key={option.value} 
                onClick={() => handleOptionSelect(option)}
                aria-selected={!!selectedOptions?.includes(option.value)}
                selected={!!selectedOptions?.includes(option.value)}
                data-value={option.value}
              >{option.label}</DropdownOption>
            ))}

            {filteredOptions.length < 1 && (
              <NoResults>No results</NoResults>
            )}
          </Dropdown>
        )}
      </Portal>
    </>
  )
});

const NoResults = styled.div({
  fontFamily: 'arial',
  fontSize: '0.875rem',
  padding: '.5rem 0',
  textAlign: 'center',
});

const BaseAutocomplete = styled.div({
  background: 'var(--input-bg)',
  borderRadius: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  height: 40,
});

const Dropdown = styled.div({
  background: '#fff',
  boxShadow: '0 3px 8px rgba(0,0,0,.20)',
  borderRadius: '4px',
  alignItems: 'center',
  padding: '.25rem 0',
  maxHeight: '300px',
  overflowY: 'auto',
});

const DropdownOption = styled.div<{ selected?: boolean }>(({ selected }) => ({
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

const InputText = styled.div({
  gridArea: '1 / 1 / 2 / 3',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  margin: '0 2px',
  fontSize: '0.875rem',
  fontFamily: 'arial',
})

const Input = styled.input({
  fontSize: '0.875rem',
  fontFamily: 'arial',
  border: '0',
  background: 'transparent',
  color: '#111',
  visibility: 'visible',
  flex: '1 1 auto',
  display: 'inline-grid',
  gridArea: '1 / 1 / 2 / 3',
  gridTemplateColumns: '0px min-content',
  margin: '0 2px',
  padding: '8px 0px',
  cursor: 'pointer',
  '&:focus, &:focus-visible': {
    outline: 'none',
  }
});

const InputContainer = styled.div({
  alignItems: 'center',
  display: 'grid',
  flex: '1 1 0%',
  flexWrap: 'wrap',
  position: 'relative',
  overflow: 'hidden',
  padding: '2px 6px',
  boxSizing: 'border-box',
})

const Close = styled.span<{ disabled?: boolean, opened?: boolean }>(({ disabled, opened }) => ({
  padding: '0 12px',
  fontFamily: 'arial',
  fontSize: '0.75rem',
  lineHeight: 1,
  pointerEvents: 'none',
  ...(disabled && {
    opacity: '.4',
  }),
  ...(opened && { transform: 'scaleY(-1)' }),
}));
