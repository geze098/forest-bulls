import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import { useLanguage } from '../../contexts/LanguageContext';
import images from './images';
import classes from './LanguagePicker.module.css';

const data = [
  { label: 'AT', image: images.at }, // Austria
  { label: 'BE', image: images.be }, // Belgium
  { label: 'BG', image: images.bg }, // Bulgaria
  { label: 'CY', image: images.cy }, // Cyprus
  { label: 'CZ', image: images.cz }, // Czech Republic
  { label: 'DE', image: images.de }, // Germany
  { label: 'DK', image: images.dk }, // Denmark
  { label: 'EE', image: images.ee }, // Estonia
  { label: 'ES', image: images.es }, // Spain
  { label: 'FI', image: images.fi }, // Finland
  { label: 'FR', image: images.fr }, // France
  { label: 'GR', image: images.gr }, // Greece
  { label: 'HR', image: images.hr }, // Croatia
  { label: 'HU', image: images.hu }, // Hungary
  { label: 'IE', image: images.ie }, // Ireland
  { label: 'IT', image: images.it }, // Italy
  { label: 'LT', image: images.lt }, // Lithuania
  { label: 'LU', image: images.lu }, // Luxembourg
  { label: 'LV', image: images.lv }, // Latvia
  { label: 'MT', image: images.mt }, // Malta
  { label: 'NL', image: images.nl }, // Netherlands
  { label: 'PL', image: images.pl }, // Poland
  { label: 'PT', image: images.pt }, // Portugal
  { label: 'RO', image: images.ro }, // Romania
  { label: 'SE', image: images.se }, // Sweden
  { label: 'SI', image: images.si }, // Slovenia
  { label: 'SK', image: images.sk }, // Slovakia
];

export function LanguagePicker() {
  const [opened, setOpened] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();
  
  // Find the selected country based on current language
  const selected = data.find(item => item.label === currentLanguage) || data[0];
  
  const items = data.map((item) => (
    <Menu.Item
      leftSection={<Image src={item.image} width={18} height={18} />}
      onClick={() => changeLanguage(item.label)}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <Image src={selected.image} w={22} h={22} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown style={{ maxHeight: '200px', overflowY: 'auto' }}>{items}</Menu.Dropdown>
    </Menu>
  );
}