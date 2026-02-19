import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { useGetTags } from '../api/getTags';
import { Select, type Option } from './Select';
import { useCallback, useMemo, useState } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';

type TagModalProps = DialogPrimitive.DialogProps & {
  selectedTags: string[];
  onClose: () => void;
  onChange?: (tags: string[]) => void;
};

export const TagModal = ({ selectedTags, onClose, onChange, ...props }: TagModalProps) => {
  const { data } = useGetTags();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const tags = useMemo(() => {
    const options = data?.map((tag) => {
      return { value: tag?.slug.en, label: tag?.slug.en };
    }) ?? [];

    return options as Record<string, string>[];
  }, [data]);

  const selected = useMemo(() => {
    return tags.filter((tag) => {
      return selectedTags?.includes(tag.value);
    })
  }, [selectedTags, tags]);

  const handleChange = useCallback((options: Option[]) => {
    const tags = options.map(option => option.value);

    onChange?.(tags);
  }, [onChange]);

  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay ref={setContainer} />
        <Dialog.Content style={{ zIndex: 2 }}>
          <Dialog.Title>Add tags</Dialog.Title>
          
          <Flex direction="column" gap="4">
            <Text size="2">Add or remove labels to help others find your content.</Text>

            <Select
              isMulti
              hideSelectedOptions
              options={tags} 
              value={selected} 
              onChange={handleChange}
              name="tags"
              placeholder='Add label'
              container={container ?? null}
            />

            <Flex justify="end">
              <Button color="blue" onClick={onClose}>
                Close
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}