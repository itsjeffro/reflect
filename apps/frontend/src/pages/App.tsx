import { Badge, Flex, Grid, ScrollArea, Text, Box, Button } from "@radix-ui/themes"
import { CalendarMonth } from "../common/components/CalendarMonth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format, isToday, parse, set } from "date-fns";
import { useCreateEntry } from "../common/api/createEntry";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { EntryModel, EntryRequest } from "../common/api/types/entry.types";
import { useGetEntriesByCalendarYear } from "../common/api/getEntriesByCalendarYear";
import { useGetEntries } from "../common/api/getEntries";
import styled from "@emotion/styled";
import { useUpdateEntryById } from "../common/api/updateEntryById";
import { useAutoSave } from "../common/hooks/useAutoSave";
import { Editor } from "../common/components/Editor";
import { useSearchParams } from "react-router";
import { EntryList } from "../common/components/EntryList";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useDeleteEntryById } from "../common/api/deleteEntryById";
import { Content } from "../common/components/Content";
import { Sidebar, SidebarPadding } from "../common/components/Sidebar";
import { EditorOption, EditorOptions } from "../common/components/EditorOptions";
import { IconTag, IconTrash } from "@tabler/icons-react";

const MONTHS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

function App() {
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const date = useMemo(() => {
    const selectedDate = searchParams.get('date');

    if (selectedDate) {
      return new Date(selectedDate);
    }

    return new Date();
  }, [searchParams]);

  const [selectedDate, setSelectedDate] = useState<string>(format(date, 'y-MM-dd'));
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const formUpdate = useForm<EntryRequest>();

  const { data: entriesByYear } = useGetEntriesByCalendarYear({ year: 2026 });
  const { data: entries, isPending: isEntriesPending, refetch } = useGetEntries({ published_at: selectedDate });

  const { mutate: createEntry, isPending: isCreatePending } = useCreateEntry({
    onSuccess: (data) => {
      refetch();
      formUpdate.reset(data as EntryRequest);
      editorRef.current?.focus();
    },
    onError: (error) => alert(JSON.stringify(error)),
  });

  const { mutate: updateEntry, isPending } = useUpdateEntryById({
    onSuccess: (data) => formUpdate.reset(data as EntryRequest),
    onError: (error) => alert(JSON.stringify(error)),
  });

  const { mutate: deleteEntry } = useDeleteEntryById({
    onSuccess: () => {
      refetch();
      editorRef.current?.focus();
    },
    onError: (error) => alert(JSON.stringify(error)),
  });

  const entryId = useMemo(() => {
    if (selectedId) {
      return selectedId;
    }
    if (!entries?.[0]) {
      return null;
    }
    return entries?.[0].id;
  }, [entries, selectedId]);

  const entry = useMemo(() => {
    if (!entries?.[0]) {
      return null;
    }
    return entries?.find(entry => entry.id === entryId) ?? null;
  }, [entries, entryId]);

  const handleDateClick = useCallback((selectedDate: Date) => {
    const formattedDate = format(selectedDate, 'y-MM-dd')

    setSelectedDate(formattedDate);
    setSearchParams({ date: formattedDate });
    setSelectedId(null);

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
    const now = new Date();

    let publishedAt = parse(selectedDate, 'y-MM-dd', Date.now());

    publishedAt = set(publishedAt, {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    });

    createEntry({ content: '', published_at: format(publishedAt, 'y-MM-dd hh:mm:ss') });
  }, [createEntry, selectedDate]);

  const handleDeleteClick = useCallback((id: number) => {
    deleteEntry({ id });
  }, [deleteEntry])

  const handleItemClick = useCallback((row: EntryModel) => {
    setSelectedId(row.id);
  }, [])

  const heading = useMemo(() => {
    if (isToday(selectedDate)) {
      return 'Today';
    }

    return format(selectedDate, 'dd MMMM y');
  }, [selectedDate]);

  const updatedAt = useWatch({ control: formUpdate.control, name: 'updated_at' });

  useAutoSave({
    form: formUpdate,
    onSave: handleUpdate,
  });

  useEffect(() => {
    if (entry) {
      formUpdate.reset(entry as EntryRequest);
      editorRef.current?.focus();
    }
  }, [entry, formUpdate, selectedDate]);

  return (
    <>

      <ScrollArea scrollbars="vertical" style={{ height: '100%' }} asChild>
        <Sidebar>
          <SidebarPadding>
            <Flex direction="column" gap="2">
              <Text size="4">2026</Text>
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
          </SidebarPadding>
        </Sidebar>
      </ScrollArea>

      <Main>
        <Heading>
          <Box style={{ padding: '1rem' }}>
            <Flex align="center" justify="between">
              <Text>{heading}</Text>

              <Flex gap="2" align="center">
                {isPending && <Badge color="orange">Saving...</Badge>}

                {(!isPending && updatedAt) && (
                  <Badge color="green">Updated at {format(updatedAt, 'y-MM-dd hh:mm:ss')}</Badge>
                )}
              </Flex>
            </Flex>
          </Box>
        </Heading>

        <Content>
          <Content style={{ flexDirection: 'column'}}>
            <Content>
              {(!!entry) && (
                <Section onClick={() => editorRef.current?.focus()}>
                  <Controller
                    control={formUpdate.control}
                    name="content"
                    render={({ field }) => (
                      <Editor value={field.value ?? ''} onChange={field.onChange} ref={editorRef} />
                    )}
                  />
                </Section>
              )}

              <EmptyPlaceholder>
                {(!isEntriesPending && !entry) && (
                  <Button onClick={handleCreateClick} disabled={isCreatePending}>Create entry</Button>
                )}

                {isEntriesPending && (
                  <Text>Loading...</Text>
                )}
              </EmptyPlaceholder>
            </Content>

            <EditorOptions>
              <EditorOption><IconTag size="16" color="var(--text-primary)" /> Add tag</EditorOption>
              <EditorOption onClick={() => handleDeleteClick(entryId!)}><IconTrash size="16" color="var(--text-danger)" /> Delete</EditorOption>
            </EditorOptions>
          </Content>

          <EntriesList>
            <EntryList
              entries={entries ?? []}
              isLoading={isEntriesPending}
              selected={(row) => entryId === row.id}
              onDeleteClick={handleDeleteClick}
              onItemClick={handleItemClick}
            />
          </EntriesList>
        </Content>
      </Main>
    </>
  )
}

export default App;

const Main = styled.main({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

const Heading = styled.div({
  flex: '0 0 auto',
});

const EntriesList = styled.div({
  width: '300px',
  flexShrink: 0,
  padding: '0 1rem 1rem 0',
});

const Section = styled.div({
  width: '100%',
  padding: '0 1rem 1rem',
});

const EmptyPlaceholder = styled.div({
  width: '100%',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});