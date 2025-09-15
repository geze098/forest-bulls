'use client';

import { useState, useRef, useEffect } from 'react';
import { TextInput, Paper, Group, Text, Stack, Loader, ActionIcon } from '@mantine/core';
import { IconSearch, IconMapPin, IconX } from '@tabler/icons-react';
import { useLocationSuggestions } from '@/hooks/useLocationSearch';
import { LocationResult } from '@/lib/locationSearch';
import classes from './LocationSearchInput.module.css';

interface LocationSearchInputProps {
  onLocationSelect: (location: LocationResult) => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function LocationSearchInput({
  onLocationSelect,
  placeholder = "Search for cities, states, or countries...",
  value = '',
  onChange
}: LocationSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading, hasSuggestions } = useLocationSuggestions(query);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setQuery(newValue);
    onChange?.(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleLocationSelect = (location: LocationResult) => {
    setQuery(location.name);
    onChange?.(location.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onLocationSelect(location);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen || !hasSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleLocationSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    onChange?.('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'country':
        return '🌍';
      case 'state':
        return '🏛️';
      case 'city':
        return '🏙️';
      default:
        return '📍';
    }
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'country':
        return 'Country';
      case 'state':
        return 'State/Province';
      case 'city':
        return 'City';
      default:
        return 'Location';
    }
  };

  return (
    <div className={classes.container}>
      <TextInput
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        leftSection={<IconSearch size={16} />}
        rightSection={
          <Group gap={4}>
            {isLoading && <Loader size={16} />}
            {query && (
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={handleClear}
              >
                <IconX size={14} />
              </ActionIcon>
            )}
          </Group>
        }
        classNames={{
          input: classes.input
        }}
      />

      {isOpen && (hasSuggestions || isLoading) && (
        <Paper
          ref={dropdownRef}
          className={classes.dropdown}
          shadow="md"
          radius="md"
          withBorder
        >
          {isLoading && (
            <div className={classes.loadingContainer}>
              <Loader size="sm" />
              <Text size="sm" c="dimmed">Searching...</Text>
            </div>
          )}

          {!isLoading && hasSuggestions && (
            <Stack gap={0}>
              {suggestions.map((location, index) => (
                <div
                  key={location.id}
                  className={`${classes.suggestion} ${
                    index === selectedIndex ? classes.suggestionSelected : ''
                  }`}
                  onClick={() => handleLocationSelect(location)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Group gap="sm" wrap="nowrap">
                    <div className={classes.locationIcon}>
                      {getLocationTypeIcon(location.type)}
                    </div>
                    <div className={classes.locationInfo}>
                      <Text size="sm" fw={500}>
                        {location.name}
                      </Text>
                      <Group gap={4}>
                        <Text size="xs" c="dimmed">
                          {getLocationTypeLabel(location.type)}
                        </Text>
                        {location.parent && (
                          <>
                            <Text size="xs" c="dimmed">•</Text>
                            <Text size="xs" c="dimmed">
                              {location.parent}
                            </Text>
                          </>
                        )}
                      </Group>
                    </div>
                    <IconMapPin size={16} className={classes.mapIcon} />
                  </Group>
                </div>
              ))}
            </Stack>
          )}

          {!isLoading && !hasSuggestions && query.length >= 2 && (
            <div className={classes.noResults}>
              <Text size="sm" c="dimmed">No locations found</Text>
            </div>
          )}
        </Paper>
      )}
    </div>
  );
}