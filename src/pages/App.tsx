import { Badge, Button, Container, Flex, Grid, Heading, ScrollArea, Text } from "@radix-ui/themes"
import { CalendarMonth } from "../common/components/CalendarMonth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format, isToday } from "date-fns";
import { useCreateEntry } from "../common/api/createEntry";
import { Controller, useForm } from "react-hook-form";
import type { EntryRequest } from "../common/api/types/entry.types";
import { useGetEntriesByCalendarYear } from "../common/api/getEntriesByCalendarYear";
import { useGetEntries } from "../common/api/getEntries";
import styled from "@emotion/styled";
import { useUpdateEntryById } from "../common/api/updateEntryById";
import { useAutoSave } from "../common/hooks/useAutoSave";
import { Editor } from "../common/components/Editor";
import { useSearchParams } from "react-router";

const MONTHS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const date = useMemo(() => {
    const selectedDate = searchParams.get('date');

    if (selectedDate) {
      return new Date(selectedDate);
    }

    return new Date();
  }, [searchParams]);

  const [selectedDate, setSelectedDate] = useState<string>(format(date, 'y-MM-dd'));

  const formUpdate = useForm<EntryRequest>();

  const { data: entriesByYear } = useGetEntriesByCalendarYear({ year: 2026 });
  const { data: entries, isPending: isEntriesPending, refetch } = useGetEntries({ published_at: selectedDate });

  const { mutate: createEntry, isPending: isCreatePending } = useCreateEntry({
    onSuccess: (data) => {
      refetch();
      formUpdate.reset(data as EntryRequest);
    },
    onError: (error) => alert(JSON.stringify(error)),
  });

  const { mutate: updateEntry, isPending, isSuccess } = useUpdateEntryById({
    onSuccess: (data) => formUpdate.reset(data as EntryRequest),
    onError: (error) => alert(JSON.stringify(error)),
  });

  const entry = useMemo(() => {
    if (!entries?.[0]) {
      return null;
    }
    return entries?.[0]
  }, [entries]);

  const handleDateClick = useCallback((selectedDate: Date) => {
    const formattedDate = format(selectedDate, 'y-MM-dd')

    setSelectedDate(formattedDate);
    setSearchParams({ date: formattedDate });

    formUpdate.reset({ content: '' });
  }, [formUpdate, setSearchParams]);

  const handleUpdate = useCallback((data: EntryRequest) => {
    const { title, content, published_at } = data;
    const payload = { title, content, published_at };

    if (!entry?.id) {
      alert('Missing entry ID');
      return;
    }

    updateEntry({ id: entry?.id, payload })
  }, [updateEntry, entry]);

  const handleCreateClick = useCallback(() => {
    createEntry({ content: '', published_at: selectedDate });
  }, [createEntry, selectedDate]);

  const heading = useMemo(() => {
    if (isToday(selectedDate)) {
      return 'Today';
    }

    return format(selectedDate, 'dd MMMM y');
  }, [selectedDate])

  useAutoSave({
    form: formUpdate,
    onSave: handleUpdate,
  });

  useEffect(() => {
    if (entry) {
      formUpdate.reset(entry as EntryRequest);
    }
  }, [entry, formUpdate, selectedDate])

  return (
    <Flex direction="row" height="100%" display="flex">
      <ScrollArea scrollbars="vertical" style={{ height: '100%' }} asChild>
        <Sidebar>
          <Content>
            <Flex direction="column" gap="2">
              <Heading as="h2" size="4">2026</Heading>
              <Grid columns="1fr" gap="5">
                {MONTHS.map((month) => (
                  <CalendarMonth
                    key={month}
                    date={date}
                    month={month}
                    onDateClick={handleDateClick}
                    events={entriesByYear}
                    selectedDate={selectedDate}
                  />
                ))}
              </Grid>
            </Flex>
          </Content>
        </Sidebar>
      </ScrollArea>

      <Main>
        <Container maxWidth="1300px">
          <Content>
            <Flex direction="column" gap="4">
              <Flex align="center" justify="between">
                <Heading as="h2" size="4">{heading}</Heading>
                {isPending && <Badge color="orange">Saving...</Badge>}
                {(!isPending && isSuccess) && <Badge color="green">Saved!</Badge>}
              </Flex>

              {isEntriesPending && (
                <Text size="2">Loading entry...</Text>
              )}

              {(!!entry) && (
                <Controller
                  control={formUpdate.control}
                  name="content"
                  render={({ field }) => (
                    <Editor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              )}

              {(!isEntriesPending && !entry) && (
                <Flex align="center" gap="2">
                  <Text>No entries yet.</Text> <Button onClick={handleCreateClick} disabled={isCreatePending}>Create entry</Button>
                </Flex>
              )}
            </Flex>
          </Content>
        </Container>
      </Main>
    </Flex>
  )
}

export default App

const Sidebar = styled.aside({
  boxShadow: 'inset -1px 0 1px -1px rgba(0, 0, 0, .40);',
  overflowY: 'hidden',
  width: '300px',
  flexShrink: 0,
});

const Main = styled.main({
  flexGrow: '1',
  overflowY: 'auto',
});

const Content = styled.div({
  padding: '1rem',
});
