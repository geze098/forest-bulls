'use client';

import { Suspense } from 'react';
import { Container, Title, Text, Loader, Box } from '@mantine/core';
import { Map } from '@/components/Map';
import { useSearchParams } from 'next/navigation';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="md">
        Search Results
      </Title>
      {query && (
        <Text size="lg" mb="xl" c="dimmed">
          Showing results for: "{query}"
        </Text>
      )}
      
      <Box h={600}>
        <Map />
      </Box>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchContent />
    </Suspense>
  );
}