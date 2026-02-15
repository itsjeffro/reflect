import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { useGetTags } from '../api/getTags';
import { Select, type Option } from './Select';
import { useCallback, useMemo, useRef, useState } from 'react';

type TagModalProps = Dialog.RootProps & {
  onClose: () => void;
};

export const TagModal = ({ onClose, ...props }: TagModalProps) => {
  const { data } = useGetTags();
  const [selectedTags, setSelectedTags] = useState<Record<string, string>[]>([]);
  const dialogRef = useRef(null);

  const tags = useMemo(() => {
    const options = data?.map((tag) => {
      return { value: tag?.slug.en, label: tag.name?.en };
    }) ?? [];

    return options as Record<string, string>[];
  }, [data]);

  const handleChange = useCallback((options: Option[]) => {
    console.log(options);
    setSelectedTags(options);
  }, []);

  return (
    <Dialog.Root {...props}>
      <Dialog.Content ref={dialogRef} style={{ zIndex: 2 }}>
        <Dialog.Title>Add tags</Dialog.Title>
        
        <Flex direction="column" gap="4">
          <Text size="2">Add or remove labels to help others find your content.</Text>

          <Select
            isMulti
            options={tags} 
            value={selectedTags} 
            onChange={handleChange}
            name="tags"
            placeholder='Add label'
          />

          <Flex justify="end">
            <Button color="blue" onClick={onClose}>
              Close
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}