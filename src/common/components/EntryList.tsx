import { format } from "date-fns";
import type { EntryModel } from "../api/types/entry.types"
import styled from "@emotion/styled";
import { Button, Text } from "@radix-ui/themes";

type EntryListProps = {
  entries: EntryModel[];
  isLoading?: boolean;
  onDeleteClick?: (entryId: number) => void;
}

export const EntryList = ({ entries, isLoading, onDeleteClick }: EntryListProps) => {
  return (
    <EntryListWrapper>
      <EntryListHeading>
        <Text weight="bold">Entries</Text>
      </EntryListHeading>
      {!isLoading && entries.map((entry) => (
        <EntryListItem key={entry.id}>
          <Text size="2">{entry.title ?? `Entry #${entry.id} - ${format(entry.published_at, 'hh:mm aa')}`}</Text>
          <Button size="1" color="red" onClick={() => onDeleteClick?.(entry.id)}>X</Button>
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
  background: '#f5f5f5',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  height: '100%',
  borderRadius: '4px',
});

const EntryListHeading = styled.div({
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid rgba(0,0,0,.07)',
})

const EntryListItem = styled.div({
  padding: '0.5rem 0.75rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:not(:last-of-type)': {
    borderBottom: '1px solid rgba(0,0,0,.07)'
  },
  '&:hover': {
    background: '#e8e6e6',
  }
});