// NINJAS NKT - localStorage Management

import { AppState, Investigator, Person, Faction, Case, Report } from '@/types';

const STORAGE_KEY = 'ninjas-nkt-data';

// Default investigators as specified
const DEFAULT_INVESTIGATORS: Investigator[] = [
  { id: 'hinata', name: 'Hinata', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'luciano', name: 'Luciano', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'miranda', name: 'Miranda', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'lara', name: 'Lara', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'hiro', name: 'Hiro', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'naira', name: 'Naira', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'miguel', name: 'Miguel', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'eloa', name: 'Eloa', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'noah', name: 'Noah', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
  { id: 'lua', name: 'Lua', photo: '/placeholder.svg', createdAt: new Date().toISOString() },
];

export const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Ensure default investigators exist
      const investigators = [...DEFAULT_INVESTIGATORS];
      if (data.investigators) {
        data.investigators.forEach((inv: Investigator) => {
          const index = investigators.findIndex(i => i.id === inv.id);
          if (index >= 0) {
            investigators[index] = inv; // Update existing
          } else {
            investigators.push(inv); // Add new
          }
        });
      }
      
      return {
        investigators,
        people: data.people || [],
        factions: data.factions || [],
        cases: data.cases || [],
        reports: data.reports || [],
        currentInvestigator: data.currentInvestigator || null,
      };
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }
  
  return {
    investigators: DEFAULT_INVESTIGATORS,
    people: [],
    factions: [],
    cases: [],
    reports: [],
    currentInvestigator: null,
  };
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// ID Generators
export const generatePersonId = (people: Person[]): string => {
  const count = people.length + 1;
  return `P-${count.toString().padStart(2, '0')}`;
};

export const generateCaseId = (cases: Case[]): string => {
  const count = cases.length + 1;
  return `C-${count.toString().padStart(2, '0')}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};