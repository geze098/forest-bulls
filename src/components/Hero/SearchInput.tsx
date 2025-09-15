'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, TextInput, TextInputProps, useMantineTheme } from '@mantine/core';

export function SearchInput(props: TextInputProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <TextInput
      radius="xl"
      size="md"
      placeholder="Search destinations, hotels, or activities"
      rightSectionWidth={42}
      leftSection={<IconSearch size={18} stroke={1.5} />}
      rightSection={
        <ActionIcon 
          size={32} 
          radius="xl" 
          color={theme.primaryColor} 
          variant="filled"
          onClick={handleSearch}
          style={{ cursor: 'pointer' }}
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      value={searchValue}
      onChange={(event) => setSearchValue(event.currentTarget.value)}
      onKeyPress={handleKeyPress}
      {...props}
    />
  );
}