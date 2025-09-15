import { SelectionModal } from './SelectionModal';
import currenciesData from '../constants/currencies.json';
import { useState } from 'react';
import { Text, Group } from '@mantine/core';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
  defaultCurrency?: Currency;
  buttonVariant?: string;
}

export function CurrencySelector({ 
  onCurrencyChange, 
  defaultCurrency,
  buttonVariant = "default" 
}: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    defaultCurrency || currenciesData.suggestedCurrencies[0] as Currency
  );

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    onCurrencyChange?.(currency);
  };

  const renderCurrencyItem = (currency: Currency) => (
    <button
      key={currency.code}
      onClick={() => handleCurrencySelect(currency)}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: selectedCurrency?.code === currency.code 
          ? 'var(--mantine-color-blue-light)' 
          : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (selectedCurrency?.code !== currency.code) {
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-light)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedCurrency?.code !== currency.code) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Group justify="space-between" w="100%">
        <Text size="sm" fw={500} ta="left">{currency.name}</Text>
        <Text size="sm" c="dimmed">{currency.code}</Text>
      </Group>
    </button>
  );

  return (
    <SelectionModal
      title="Select your currency"
      description="Where applicable prices will be converted to, and shown in, the currency that you select. The currency you pay in may differ based on your reservation, and a service fee may also apply."
      buttonText={`${selectedCurrency.symbol} ${selectedCurrency.code}`}
      buttonVariant={buttonVariant}
      suggestedItems={currenciesData.suggestedCurrencies as Currency[]}
      allItems={currenciesData.allCurrencies as Currency[]}
      selectedItem={selectedCurrency}
      onSelect={handleCurrencySelect}
      renderItem={renderCurrencyItem}
    />
  );
}