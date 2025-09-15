import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text, Group, Stack, Divider, ScrollArea } from '@mantine/core';
import { ReactNode } from 'react';

interface SelectionItem {
  code: string;
  name: string;
  symbol?: string;
}

interface SelectionModalProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonVariant?: string;
  suggestedItems?: SelectionItem[];
  allItems: SelectionItem[];
  selectedItem?: SelectionItem;
  onSelect: (item: SelectionItem) => void;
  renderItem?: (item: SelectionItem) => ReactNode;
}

export function SelectionModal({
  title,
  description,
  buttonText,
  buttonVariant = "default",
  suggestedItems,
  allItems,
  selectedItem,
  onSelect,
  renderItem
}: SelectionModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleSelect = (item: SelectionItem) => {
    onSelect(item);
    close();
  };

  const defaultRenderItem = (item: SelectionItem) => (
    <Button
      key={item.code}
      variant="subtle"
      justify="space-between"
      fullWidth
      onClick={() => handleSelect(item)}
      style={{
        height: 'auto',
        padding: '12px 16px',
        backgroundColor: selectedItem?.code === item.code ? 'var(--mantine-color-blue-light)' : 'transparent'
      }}
    >
      <Group justify="space-between" w="100%">
        <Text size="sm" fw={500}>{item.name}</Text>
        <Text size="sm" c="dimmed">{item.code}</Text>
      </Group>
    </Button>
  );

  const itemRenderer = renderItem || defaultRenderItem;

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={close} 
        title={title} 
        centered
        size="md"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack gap="md">
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
          
          {suggestedItems && suggestedItems.length > 0 && (
            <>
              <Text size="sm" fw={600} c="blue">
                Suggested for you
              </Text>
              <Stack gap="xs">
                {suggestedItems.map(itemRenderer)}
              </Stack>
              <Divider />
            </>
          )}
          
          <Text size="sm" fw={600}>
            All {title.toLowerCase()}
          </Text>
          
          <ScrollArea.Autosize mah={300}>
            <Stack gap="xs">
              {allItems.map(itemRenderer)}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      </Modal>

      <Button variant={buttonVariant} onClick={open}>
        {buttonText}
      </Button>
    </>
  );
}