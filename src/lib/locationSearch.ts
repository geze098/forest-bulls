import { Country, State, City } from 'country-state-city';

export interface LocationResult {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'region' | 'subregion';
  countryCode?: string;
  stateCode?: string;
  latitude?: number;
  longitude?: number;
  parent?: string;
}

/**
 * Search for locations (countries, states, cities) based on query string
 * @param query - Search term
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Array of location results
 */
export function searchLocations(query: string, limit: number = 10): LocationResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results: LocationResult[] = [];

  // Search countries
  const countries = Country.getAllCountries();
  countries.forEach(country => {
    if (country.name.toLowerCase().includes(searchTerm) || 
        country.isoCode.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `country-${country.isoCode}`,
        name: country.name,
        type: 'country',
        countryCode: country.isoCode,
        latitude: parseFloat(country.latitude) || undefined,
        longitude: parseFloat(country.longitude) || undefined
      });
    }
  });

  // Search states
  countries.forEach(country => {
    const states = State.getStatesOfCountry(country.isoCode);
    states.forEach(state => {
      if (state.name.toLowerCase().includes(searchTerm) ||
          state.isoCode.toLowerCase().includes(searchTerm)) {
        results.push({
          id: `state-${country.isoCode}-${state.isoCode}`,
          name: state.name,
          type: 'state',
          countryCode: country.isoCode,
          stateCode: state.isoCode,
          latitude: parseFloat(state.latitude) || undefined,
          longitude: parseFloat(state.longitude) || undefined,
          parent: country.name
        });
      }
    });
  });

  // Search cities
  countries.forEach(country => {
    const states = State.getStatesOfCountry(country.isoCode);
    states.forEach(state => {
      const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
      cities.forEach(city => {
        if (city.name.toLowerCase().includes(searchTerm)) {
          results.push({
            id: `city-${country.isoCode}-${state.isoCode}-${city.name}`,
            name: city.name,
            type: 'city',
            countryCode: country.isoCode,
            stateCode: state.isoCode,
            latitude: parseFloat(city.latitude) || undefined,
            longitude: parseFloat(city.longitude) || undefined,
            parent: `${state.name}, ${country.name}`
          });
        }
      });
    });
  });

  // Sort results by relevance (exact matches first, then partial matches)
  results.sort((a, b) => {
    const aExact = a.name.toLowerCase() === searchTerm;
    const bExact = b.name.toLowerCase() === searchTerm;
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    const aStarts = a.name.toLowerCase().startsWith(searchTerm);
    const bStarts = b.name.toLowerCase().startsWith(searchTerm);
    
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    return a.name.localeCompare(b.name);
  });

  return results.slice(0, limit);
}

/**
 * Get country by ISO code
 * @param countryCode - ISO country code
 * @returns Country data or null
 */
export function getCountryByCode(countryCode: string): LocationResult | null {
  const country = Country.getCountryByCode(countryCode);
  if (!country) return null;

  return {
    id: `country-${country.isoCode}`,
    name: country.name,
    type: 'country',
    countryCode: country.isoCode,
    latitude: parseFloat(country.latitude) || undefined,
    longitude: parseFloat(country.longitude) || undefined
  };
}

/**
 * Get state by country and state code
 * @param countryCode - ISO country code
 * @param stateCode - ISO state code
 * @returns State data or null
 */
export function getStateByCode(countryCode: string, stateCode: string): LocationResult | null {
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  const country = Country.getCountryByCode(countryCode);
  
  if (!state || !country) return null;

  return {
    id: `state-${countryCode}-${stateCode}`,
    name: state.name,
    type: 'state',
    countryCode: countryCode,
    stateCode: stateCode,
    latitude: parseFloat(state.latitude) || undefined,
    longitude: parseFloat(state.longitude) || undefined,
    parent: country.name
  };
}

/**
 * Get all countries
 * @returns Array of all countries
 */
export function getAllCountries(): LocationResult[] {
  const countries = Country.getAllCountries();
  return countries.map(country => ({
    id: `country-${country.isoCode}`,
    name: country.name,
    type: 'country' as const,
    countryCode: country.isoCode,
    latitude: parseFloat(country.latitude) || undefined,
    longitude: parseFloat(country.longitude) || undefined
  }));
}

/**
 * Get states of a country
 * @param countryCode - ISO country code
 * @returns Array of states
 */
export function getStatesOfCountry(countryCode: string): LocationResult[] {
  const states = State.getStatesOfCountry(countryCode);
  const country = Country.getCountryByCode(countryCode);
  
  if (!country) return [];

  return states.map(state => ({
    id: `state-${countryCode}-${state.isoCode}`,
    name: state.name,
    type: 'state' as const,
    countryCode: countryCode,
    stateCode: state.isoCode,
    latitude: parseFloat(state.latitude) || undefined,
    longitude: parseFloat(state.longitude) || undefined,
    parent: country.name
  }));
}

/**
 * Get cities of a state
 * @param countryCode - ISO country code
 * @param stateCode - ISO state code
 * @returns Array of cities
 */
export function getCitiesOfState(countryCode: string, stateCode: string): LocationResult[] {
  const cities = City.getCitiesOfState(countryCode, stateCode);
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  const country = Country.getCountryByCode(countryCode);
  
  if (!state || !country) return [];

  return cities.map(city => ({
    id: `city-${countryCode}-${stateCode}-${city.name}`,
    name: city.name,
    type: 'city' as const,
    countryCode: countryCode,
    stateCode: stateCode,
    latitude: parseFloat(city.latitude) || undefined,
    longitude: parseFloat(city.longitude) || undefined,
    parent: `${state.name}, ${country.name}`
  }));
}