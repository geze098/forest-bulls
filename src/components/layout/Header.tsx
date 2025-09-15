'use client';

import { 
  IconBook, 
  IconChartPie3, 
  IconChevronDown, 
  IconCode, 
  IconCoin, 
  IconFingerprint, 
  IconNotification,
  IconDots,
  IconHeart,
  IconLogout,
  IconDashboard,
} from '@tabler/icons-react'; 
import { 
  Anchor, 
  Avatar,
  Box, 
  Burger, 
  Button, 
  Center, 
  Collapse, 
  Divider, 
  Drawer, 
  Group, 
  HoverCard, 
  ScrollArea, 
  SimpleGrid, 
  Text, 
  ThemeIcon, 
  UnstyledButton, 
  useMantineTheme,
  Menu,
} from '@mantine/core'; 
import { useDisclosure } from '@mantine/hooks'; 
import { MantineLogo } from '@mantinex/mantine-logo'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import classes from './HeaderMegaMenu.module.css';
import { LanguagePicker } from './LanguagePicker';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { CurrencySelector } from '../CurrencySelector';
import { LanguageSelector } from '../LanguageSelector';

const getMockdata = (t: any) => [ 
  { 
    icon: IconCode, 
    title: t.features.openSource.title, 
    description: t.features.openSource.description, 
  }, 
  { 
    icon: IconCoin, 
    title: t.features.freeForEveryone.title, 
    description: t.features.freeForEveryone.description, 
  }, 
  { 
    icon: IconBook, 
    title: t.features.documentation.title, 
    description: t.features.documentation.description, 
  }, 
  { 
    icon: IconFingerprint, 
    title: t.features.security.title, 
    description: t.features.security.description, 
  }, 
  { 
    icon: IconChartPie3, 
    title: t.features.analytics.title, 
    description: t.features.analytics.description, 
  }, 
  { 
    icon: IconNotification, 
    title: t.features.notifications.title, 
    description: t.features.notifications.description, 
  }, 
];

export function HeaderMegaMenu() { 
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false); 
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false); 
  const [visibleLinks, setVisibleLinks] = useState(5);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const theme = useMantineTheme(); 
  const { t } = useLanguage();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  // Click handlers for auth buttons
  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  const handleSignupClick = () => {
    router.push('/auth/register');
  };

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpened(false);
  };

  const mockdata = getMockdata(t);

  // Navigation items
  const navigationItems = [
    { key: 'stays', label: t.header.stays, href: '#' },
    { key: 'transport', label: t.header.transport, href: '#', hasDropdown: true },
    { key: 'attractions', label: t.header.attractions, href: '#' },
    { key: 'packages', label: t.header.packages, href: '#' },
    { key: 'couponsDeals', label: t.header.couponsDeals, href: '#' },
    { key: 'travelGuides', label: t.header.travelGuides, href: '#' }
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1200) {
        setVisibleLinks(2);
        setShowMoreMenu(true);
      } else if (width < 1400) {
        setVisibleLinks(3);
        setShowMoreMenu(true);
      } else {
        setVisibleLinks(6);
        setShowMoreMenu(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = mockdata.map((item) => ( 
    <UnstyledButton className={classes.subLink} key={item.title}> 
      <Group wrap="nowrap" align="flex-start"> 
        <ThemeIcon size={34} variant="default" radius="md"> 
          <item.icon size={22} color={theme.colors.blue[6]} /> 
        </ThemeIcon> 
        <div> 
          <Text size="sm" fw={500}> 
            {item.title} 
          </Text> 
          <Text size="xs" c="dimmed"> 
            {item.description} 
          </Text> 
        </div> 
      </Group> 
    </UnstyledButton> 
  ));

  return ( 
    <Box pb={120}> 
      <header className={classes.header}> 
        <Group justify="space-between" h="100%"> 
          <MantineLogo size={30} /> 

          <Group h="100%" gap={0} visibleFrom="sm" style={{ flexWrap: 'nowrap', overflow: 'hidden' }}> 
            {navigationItems.slice(0, visibleLinks).map((item) => {
              if (item.hasDropdown) {
                return (
                  <HoverCard key={item.key} width={300} position="bottom" radius="md" shadow="md" withinPortal> 
                    <HoverCard.Target> 
                      <a href={item.href} className={classes.link}> 
                        <Center inline> 
                          <Box component="span" mr={5}> 
                            {item.label} 
                          </Box> 
                          <IconChevronDown size={16} color={theme.colors.blue[6]} /> 
                        </Center> 
                      </a> 
                    </HoverCard.Target> 

                    <HoverCard.Dropdown style={{ overflow: 'hidden' }}> 
                      <Group justify="space-between" px="md"> 
                        <Text fw={500}>{t.header.transport}</Text> 
                      </Group> 

                      <Divider my="sm" /> 

                      <div style={{ padding: '0 16px' }}> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.flights} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.buses} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.trains} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.ferries} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.airportTransfer} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.carRentals} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.cars} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.cruises} 
                        </a> 
                        <a href="#" className={classes.subLink} style={{ display: 'block', padding: '8px 0', textDecoration: 'none', color: 'inherit' }}> 
                          {t.header.airportTaxis} 
                        </a> 
                      </div> 
                    </HoverCard.Dropdown> 
                  </HoverCard>
                );
              }
              return (
                <a key={item.key} href={item.href} className={classes.link}> 
                  {item.label} 
                </a>
              );
            })}
            {showMoreMenu && navigationItems.length > visibleLinks && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <a href="#" className={classes.link}>
                    <IconDots size={16} />
                  </a>
                </Menu.Target>
                <Menu.Dropdown>
                  {navigationItems.slice(visibleLinks).map((item) => (
                    <Menu.Item key={item.key}>
                      <a href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.label}
                      </a>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group> 

          <Group visibleFrom="sm"> 
            <CurrencySelector buttonVariant="subtle" />
            <LanguageSelector buttonVariant="subtle" />
            {user ? (
              <Menu 
                width={260} 
                position="bottom-end" 
                transitionProps={{ transition: 'pop-top-right' }} 
                onClose={() => setUserMenuOpened(false)} 
                onOpen={() => setUserMenuOpened(true)} 
                withinPortal 
              > 
                <Menu.Target> 
                  <UnstyledButton 
                    className={`${classes.user} ${userMenuOpened ? classes.userActive : ''}`}
                  > 
                    <Group gap={7}> 
                      <Avatar src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} radius="xl" size={20} /> 
                      <Text fw={500} size="sm" lh={1} mr={3}> 
                        {user.user_metadata?.full_name || user.email} 
                      </Text> 
                      <IconChevronDown size={12} stroke={1.5} /> 
                    </Group> 
                  </UnstyledButton> 
                </Menu.Target> 
                <Menu.Dropdown> 
                  {(user.role === 'administrator' || user.role === 'owner') && (
                    <>
                      <Menu.Item 
                        leftSection={<IconDashboard size={16} color={theme.colors.blue[6]} stroke={1.5} />}
                        onClick={() => router.push('/dashboard')}
                      > 
                        Dashboard 
                      </Menu.Item>
                      <Menu.Divider />
                    </>
                  )}
                  <Menu.Item 
                    leftSection={<IconHeart size={16} color={theme.colors.red[6]} stroke={1.5} />}
                    onClick={() => router.push('/wishlist')}
                  > 
                    Wishlist 
                  </Menu.Item> 
                  
                  <Menu.Divider />
                  
                  <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />} onClick={handleLogout}>
                    Logout
                  </Menu.Item> 
                </Menu.Dropdown> 
              </Menu>
            ) : (
              <>
                <Button variant="default" onClick={handleLoginClick}>{t.header.login}</Button> 
                <Button onClick={handleSignupClick}>{t.header.signup}</Button>
              </>
            )}
          </Group> 

          <Group hiddenFrom="sm">
            <CurrencySelector buttonVariant="subtle" />
            <LanguageSelector buttonVariant="subtle" />
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group> 
        </Group> 
      </header> 

      <Drawer 
        opened={drawerOpened} 
        onClose={closeDrawer} 
        size="100%" 
        padding="md" 
        title={t.drawer.navigation} 
        hiddenFrom="sm" 
        zIndex={1000000} 
      > 
        <ScrollArea h="calc(100vh - 80px" mx="-md"> 
          <Divider my="sm" /> 

          <a href="#" className={classes.link}> 
            {t.header.hotelsHomes} 
          </a> 
          <UnstyledButton className={classes.link} onClick={toggleLinks}> 
            <Center inline> 
              <Box component="span" mr={5}> 
                {t.header.transport} 
              </Box> 
              <IconChevronDown size={16} color={theme.colors.blue[6]} /> 
            </Center> 
          </UnstyledButton> 
          <Collapse in={linksOpened}> 
            <div style={{ paddingLeft: '20px' }}> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.flights} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.buses} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.trains} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.ferries} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.airportTransfer} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.carRentals} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.cars} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.cruises} 
              </a> 
              <a href="#" className={classes.link} style={{ display: 'block', padding: '8px 0' }}> 
                {t.header.airportTaxis} 
              </a> 
            </div> 
          </Collapse> 
          <a href="#" className={classes.link}> 
            {t.header.attractions} 
          </a> 
          <a href="#" className={classes.link}> 
            {t.header.packages} 
          </a> 
          <a href="#" className={classes.link}> 
            {t.header.couponsDeals} 
          </a> 
          <a href="#" className={classes.link}> 
            {t.header.travelGuides} 
          </a> 

          <Divider my="sm" /> 

          <Group justify="center" grow pb="xl" px="md"> 
            <Button variant="default" onClick={handleLoginClick}>{t.header.login}</Button> 
            <Button onClick={handleSignupClick}>{t.header.signup}</Button> 
          </Group> 
        </ScrollArea> 
      </Drawer> 
    </Box> 
  );
}