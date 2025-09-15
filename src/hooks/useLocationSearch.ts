import { useState, useEffect, useMemo } from 'react';
import { searchLocations, LocationResult } from '@/lib/locationSearch';

/**
 * Custom hook for location search with debouncing
 * @param query - Search query string
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @param limit - Maximum number of results (default: 10)
 * @returns Object containing search results, loading state, and error
 */
export function useLocationSearch(query: string, delay: number = 300, limit: number = 10) {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced query
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = searchLocations(debouncedQuery, limit);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, limit]);

  // Memoized results grouped by type
  const groupedResults = useMemo(() => {
    const grouped = {
      countries: results.filter(r => r.type === 'country'),
      states: results.filter(r => r.type === 'state'),
      cities: results.filter(r => r.type === 'city'),
      regions: results.filter(r => r.type === 'region'),
      subregions: results.filter(r => r.type === 'subregion')
    };
    return grouped;
  }, [results]);

  return {
    results,
    groupedResults,
    isLoading,
    error,
    hasResults: results.length > 0
  };
}

/**
 * Hook for getting location suggestions with coordinates
 * Useful for map integration
 */
export function useLocationSuggestions(query: string) {
  const { results, isLoading, error } = useLocationSearch(query, 300, 5);

  // Filter results that have coordinates
  const locationsWithCoordinates = useMemo(() => {
    return results.filter(location => 
      location.latitude !== undefined && 
      location.longitude !== undefined
    );
  }, [results]);

  return {
    suggestions: locationsWithCoordinates,
    isLoading,
    error,
    hasSuggestions: locationsWithCoordinates.length > 0
  };
}