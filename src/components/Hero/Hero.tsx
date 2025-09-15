'use client';

import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import classes from './Hero.module.css';
import { SearchInput } from './SearchInput';

export function Hero() {
  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container} size="md">
        <Title className={classes.title}>Welcome to Vama Buzau</Title>
        <Text className={classes.description} size="xl" mt="xl">
          Discover your perfect stay in the heart of Romania. Experience comfort, hospitality, and unforgettable moments.
        </Text>

        <SearchInput placeholder="Search questions" mt="xl" />
      </Container>
    </div>
  );
}