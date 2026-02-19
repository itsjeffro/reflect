import styled from "@emotion/styled"
import { Content } from "../common/components/Content"
import { useGetEntries } from "../common/api/getEntries"
import { Badge, Box, Flex, Grid, IconButton, ScrollArea, Text, Tooltip } from "@radix-ui/themes";
import { format } from "date-fns";
import { Sidebar } from "../common/components/Sidebar";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Editor } from "../common/components/Editor";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EntryModel, EntryRequest } from "../common/api/types/entry.types";
import { useAutoSave } from "../common/hooks/useAutoSave";
import { useUpdateEntryById } from "../common/api/updateEntryById";
import { useQueryClient } from "@tanstack/react-query";
import { EditorOption, EditorOptions } from "../common/components/EditorOptions";
import { IconPlus, IconTag, IconTrash } from "@tabler/icons-react";
import { useDeleteEntryById } from "../common/api/deleteEntryById";
import { useCreateEntry } from "../common/api/createEntry";
import { TagModal } from "../common/components/TagModal";
import { Modal } from "../common/components/Modal";
import { useUpdateEntryTags } from "../common/api/updateEntryTags";

export const List = () => {
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isPending: isEntriesPending } = useGetEntries();

  const formUpdate = useForm<EntryRequest>();

  const handleSuccessfulUpdate = useCallback((data: EntryModel) => {
    const { title, content, updated_at } = data;

    formUpdate.reset({ title, content, updated_at });

    queryClient.invalidateQueries({ queryKey: ['entries'] })
  }, [formUpdate, queryClient]);

  const handleSuccessfulDelete = useCallback(async () => {
    formUpdate.reset({});

    await queryClient.invalidateQueries({ queryKey: ['entries'] });

    setSelectedId(null);
    setIsConfirmModalOpen(false);
  }, [formUpdate, queryClient]);

  const handleSuccessCreate = useCallback(async (data: EntryModel) => {
    const {id, title, content, published_at} = data;

    formUpdate.reset({ title, content, published_at });

    await queryClient.invalidateQueries({ queryKey: ['entries'] });

    setSelectedId(id);
  }, [formUpdate, queryClient]);

  const { mutate: createEntry } = useCreateEntry({
    onSuccess: handleSuccessCreate,
    onError: (error) => alert(JSON.stringify(error)),
  });

  const { mutate: updateEntry, isPending: isUpdatePending } = useUpdateEntryById({
    onSuccess: handleSuccessfulUpdate,
    onError: (error) => alert(JSON.stringify(error)),
  });

  const { mutate: deleteEntry } = useDeleteEntryById({
    onSuccess: handleSuccessfulDelete,
    onError: (error) => alert(JSON.stringify(error)),
  });

  const { mutate: updateEntryTags } = useUpdateEntryTags({
    onError: (error) => alert(JSON.stringify(error)),
  })

  const entries = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.sort((a, b) => b?.id - a?.id);
  }, [data]);

  const entryId = useMemo(() => {
    return selectedId ?? entries?.[0]?.id;
  }, [selectedId, entries]);

  const entryTags = useMemo(() => {
    const entry = entries.find(entry => entry.id === entryId);

    if (!entry) {
      return [];
    }

    return entry.tags.map((tag) => tag.slug.en);
  }, [entryId, entries]);

  const handleDeleteClick = useCallback(() => {
    deleteEntry({ id: entryId });
  }, [entryId, deleteEntry]);

  useEffect(() => {
    if (!entryId || !entries?.[0]) {
      return;
    }

    const { title, published_at, content, updated_at } = entries?.find((entry) => entry.id === entryId) ?? {};

    formUpdate.reset({
      title: title ?? null,
      content: content ?? null,
      published_at: published_at ?? null,
      updated_at: updated_at ?? null,
    });
  }, [entries, formUpdate, entryId]);

  const heading = useMemo(() => {
    if (!entries?.[0]) {
      return null;
    }

    const { title, id } = entries?.find((entry) => entry.id === entryId) ?? {};

    return title ?? `Entry #${id}`
  }, [entries, entryId]);

  const updatedAt = useWatch({ control: formUpdate.control, name: 'updated_at' });

  const handleUpdate = useCallback((data: EntryRequest) => {
    const { title, content, published_at } = data;
    const payload = { title, content, published_at };

    if (!entryId) {
      alert('Missing entry ID');
      return;
    }

    updateEntry({ id: entryId, payload });
  }, [updateEntry, entryId]);

  const handleCreateEntry = useCallback(() => {
    createEntry({ title: null, content: null, published_at: format(new Date(), 'y-MM-dd hh:mm:ss') });
  }, [createEntry]);

  const handleOpenTagModalClick = useCallback(() => {
    setIsTagModalOpen(true)
  }, []);

  const handleTagChange = useCallback((tags: string[]) => {
    updateEntryTags({ id: entryId, payload: { tags } });
  }, [entryId, updateEntryTags]);

  useAutoSave({
    form: formUpdate,
    onSave: handleUpdate,
  });

  return (
    <>
      <ScrollArea scrollbars="vertical" style={{ height: '100%' }} asChild>
        <Sidebar>
          <Flex direction="column">
            <ListHeading>
              <Flex justify="between">
                <Text size="3">Entries</Text>
                <Tooltip content="Create entry">
                  <IconButton size="1" color="blue" onClick={handleCreateEntry}><IconPlus size="16px" /></IconButton>
                </Tooltip>
              </Flex>
            </ListHeading>

            {entries?.map((entry) => (
              <ListItem onClick={() => setSelectedId(entry.id)} selected={entryId === entry.id}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text size="2" weight="medium">
                    {entry?.title ?? `Entry #${entry.id}`}
                  </Text>
                  <Flex gap="1">
                    <Text size="1" style={{ flexShrink: 0 }}>{format(entry.published_at, 'dd, MMM yyyy')}</Text>
                    <Grid>
                      <Text size="1" color="gray" truncate>{entry.content}</Text>
                    </Grid>
                  </Flex>
                </div>
              </ListItem>
            ))}
          </Flex>
        </Sidebar>
      </ScrollArea>

      <Main>
        <Heading>
          <Box style={{ padding: '1rem' }}>
            <Flex align="center" justify="between">
              <Text size="3">{heading}</Text>

              <Flex gap="2" align="center">
                {isUpdatePending && <Badge color="orange">Saving...</Badge>}

                {(!isUpdatePending && updatedAt) && (
                  <Badge color="green">Updated at {format(updatedAt, 'y-MM-dd hh:mm:ss')}</Badge>
                )}
              </Flex>
            </Flex>
          </Box>
        </Heading>

        <Content style={{ flexDirection: 'column'}}>
          <Content>
            <Section onClick={() => editorRef.current?.focus()}>
              <Controller
                control={formUpdate.control}
                name="content"
                render={({ field }) => (
                  <Editor value={field.value ?? ''} onChange={field.onChange} ref={editorRef} />
                )}
              />
            </Section>

            <EmptyPlaceholder>
              {isEntriesPending && (
                <Text>Loading...</Text>
              )}
            </EmptyPlaceholder>
          </Content>

          {entryTags.length > 0 && (
            <Tags>
              <Text size="2">Tags:</Text>
              {entryTags.map((entryTag) => (
                <Tag>{entryTag}</Tag>
              ))}
            </Tags>
          )}

          <EditorOptions>
            <EditorOption onClick={handleOpenTagModalClick}><IconTag size="16" color="var(--text-primary)" /> Add tag</EditorOption>
            <EditorOption onClick={() => setIsConfirmModalOpen(true)}><IconTrash size="16" color="var(--text-danger)" /> Delete</EditorOption>
          </EditorOptions>
        </Content>
      </Main>

      <TagModal 
        selectedTags={entryTags}
        open={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onChange={handleTagChange}
      />

      <Modal
        open={isConfirmModalOpen}
        title={`Delete entry #${entryId}`} 
        actions={[
          { color: 'gray', label: 'Cancel', onClick: () => setIsConfirmModalOpen(false) },
          { color: 'red', label: 'Delete', onClick: handleDeleteClick },
        ]}
      >
        <Text size="2">Are you sure you want to delete this entry?</Text>
      </Modal>
    </>
  )
}

const Main = styled.main({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

const Heading = styled.div({
  flex: '0 0 auto',
});

const ListHeading = styled.div({
  padding: '1rem 0.875rem',
  borderBottom: '1px solid var(--border)',
})

const ListItem = styled.div<{ selected?: boolean, onClick: () => void }>(({ selected, onClick }) => ({
  borderBottom: '1px solid var(--border)',
  padding: '0.5rem 0.875rem',
  '&:hover': {
    background: '#edeff5'
  },
  ...(selected && ({
    background: '#edeff5',
    '&:hover': {
      background: '#e1e4ec'
    },
  })),
  ...(!!onClick && {
    cursor: 'pointer'
  })
}))

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

const Tags = styled.div({
  padding: '0 1rem',
  display: 'flex',
  gap: '.5rem',
  alignItems: 'center',
})

const Tag = styled.div({
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '.2rem .25rem',
  fontSize: '0.7rem',
  lineHeight: '1',
  textTransform: 'uppercase',
  fontWeight: '500'
});
