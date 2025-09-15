import { SelectionModal } from './SelectionModal';
import languagesData from '../constants/languages.json';
import { useState } from 'react';
import { Text, Group } from '@mantine/core';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
  defaultLanguage?: Language;
  buttonVariant?: string;
}



export function LanguageSelector({ 
  onLanguageChange, 
  defaultLanguage,
  buttonVariant = "default" 
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    defaultLanguage || languagesData.suggestedLanguages[0] as Language
  );

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    onLanguageChange?.(language);
  };

  const renderLanguageItem = (language: Language) => (
    <button
      key={language.code}
      onClick={() => handleLanguageSelect(language)}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: selectedLanguage?.code === language.code 
          ? 'var(--mantine-color-blue-light)' 
          : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (selectedLanguage?.code !== language.code) {
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-light)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedLanguage?.code !== language.code) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Group justify="space-between" w="100%">
        <Text size="sm" fw={500} ta="left">{language.nativeName}</Text>
        <Text size="sm" c="dimmed">{language.name}</Text>
      </Group>
    </button>
  );

  return (
    <SelectionModal
      title="Select your language"
      description="Choose your preferred language for the interface and content."
      buttonText={selectedLanguage.nativeName}
      buttonVariant={buttonVariant}
      suggestedItems={languagesData.suggestedLanguages as Language[]}
      allItems={languagesData.allLanguages as Language[]}
      selectedItem={selectedLanguage}
      onSelect={handleLanguageSelect}
      renderItem={renderLanguageItem}
    />
  );
}