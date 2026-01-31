import { format } from "date-fns";
import styled from "@emotion/styled";
import { IconButton, Text } from "@radix-ui/themes";
import { IconTrash } from '@tabler/icons-react';
import type { EntryModel } from "../api/types/entry.types";

type EntryListProps = {
  entries: EntryModel[];
  isLoading?: boolean;
  selected?: (row: EntryModel) => boolean;
  onDeleteClick?: (entryId: number) => void;
  onItemClick?: (row: EntryModel) => void;
}

export const EntryList = ({ entries, isLoading, onDeleteClick, onItemClick, selected }: EntryListProps) => {
  return (
    <EntryListWrapper>
      <EntryListHeading>
        <Text weight="bold">Entries</Text>
      </EntryListHeading>

      {!isLoading && entries.map((entry) => (
        <EntryListItem
          key={entry.id}
          onClick={() => onItemClick?.(entry)}
          isActive={selected?.(entry) ?? false}
          role="button"
        >
          <Text size="2">{entry.title ?? `Entry #${entry.id} - ${format(entry.published_at, 'hh:mm aa')}`}</Text>
          <IconButton size="1" color="red" onClick={() => onDeleteClick?.(entry.id)}><IconTrash size=".875rem" /></IconButton>
        </EntryListItem>
      ))}

      {!isLoading && entries.length === 0 && (
        <EntryListItem>
          <Text size="2">No entries</Text>
        </EntryListItem>
      )}

      {isLoading && (
        <EntryListItem>
          <Text size="2">Loading...</Text>
        </EntryListItem>
      )}
    </EntryListWrapper>
  )
};

const EntryListWrapper = styled.div({
  border: '1px solid var(--border)',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  height: '100%',
  borderRadius: '4px',
});

const EntryListHeading = styled.div({
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid var(--border)',
})

const EntryListItem = styled.div<{ isActive?: boolean }>(({ isActive }) => ({
  padding: '0.5rem 0.75rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:not(:last-of-type)': {
    borderBottom: '1px solid var(--border)'
  },
  '&:hover': {
    background: '#eceaea',
  },
  ...(isActive && {
    background: '#eceaea',
    '&:hover': {
      background: '#dddada',
    },
  })
}));