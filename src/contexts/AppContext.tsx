// NINJAS NKT - Application Context

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Investigator, Person, Faction, Case, Report } from '@/types';
import { getInitialState, saveState, generatePersonId, generateCaseId, generateId } from '@/utils/storage';

interface AppContextType {
  state: AppState;
  // Investigators
  selectInvestigator: (id: string) => void;
  updateInvestigator: (id: string, updates: Partial<Investigator>) => void;
  logout: () => void;
  
  // People
  addPerson: (person: Omit<Person, 'id' | 'createdAt'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  
  // Factions
  addFaction: (faction: Omit<Faction, 'id' | 'createdAt'>) => void;
  updateFaction: (id: string, updates: Partial<Faction>) => void;
  deleteFaction: (id: string) => void;
  
  // Cases
  addCase: (caseData: Omit<Case, 'id' | 'createdAt'>) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  closeCase: (id: string, reason: string) => void;
  deleteCase: (id: string) => void;
  
  // Reports
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Investigators
  const selectInvestigator = (id: string) => {
    setState(prev => ({ ...prev, currentInvestigator: id }));
  };

  const updateInvestigator = (id: string, updates: Partial<Investigator>) => {
    setState(prev => ({
      ...prev,
      investigators: prev.investigators.map(inv => 
        inv.id === id ? { ...inv, ...updates } : inv
      )
    }));
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentInvestigator: null }));
  };

  // People
  const addPerson = (personData: Omit<Person, 'id' | 'createdAt'>) => {
    const newPerson: Person = {
      ...personData,
      id: generatePersonId(state.people),
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      people: [...prev.people, newPerson]
    }));
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setState(prev => ({
      ...prev,
      people: prev.people.map(person => 
        person.id === id ? { ...person, ...updates } : person
      )
    }));
  };

  const deletePerson = (id: string) => {
    setState(prev => ({
      ...prev,
      people: prev.people.filter(person => person.id !== id)
    }));
  };

  // Factions
  const addFaction = (factionData: Omit<Faction, 'id' | 'createdAt'>) => {
    const newFaction: Faction = {
      ...factionData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      factions: [...prev.factions, newFaction]
    }));
  };

  const updateFaction = (id: string, updates: Partial<Faction>) => {
    setState(prev => ({
      ...prev,
      factions: prev.factions.map(faction => 
        faction.id === id ? { ...faction, ...updates } : faction
      )
    }));
  };

  const deleteFaction = (id: string) => {
    setState(prev => ({
      ...prev,
      factions: prev.factions.filter(faction => faction.id !== id)
    }));
  };

  // Cases
  const addCase = (caseData: Omit<Case, 'id' | 'createdAt'>) => {
    const newCase: Case = {
      ...caseData,
      id: generateCaseId(state.cases),
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      cases: [...prev.cases, newCase]
    }));
  };

  const updateCase = (id: string, updates: Partial<Case>) => {
    setState(prev => ({
      ...prev,
      cases: prev.cases.map(caseItem => 
        caseItem.id === id ? { ...caseItem, ...updates } : caseItem
      )
    }));
  };

  const closeCase = (id: string, reason: string) => {
    setState(prev => ({
      ...prev,
      cases: prev.cases.map(caseItem => 
        caseItem.id === id ? {
          ...caseItem,
          status: 'Fechado' as const,
          closingReason: reason,
          closedAt: new Date().toISOString()
        } : caseItem
      )
    }));
  };

  const deleteCase = (id: string) => {
    setState(prev => ({
      ...prev,
      cases: prev.cases.filter(caseItem => caseItem.id !== id)
    }));
  };

  // Reports
  const addReport = (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      reports: [...prev.reports, newReport]
    }));
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setState(prev => ({
      ...prev,
      reports: prev.reports.map(report => 
        report.id === id ? { ...report, ...updates } : report
      )
    }));
  };

  const deleteReport = (id: string) => {
    setState(prev => ({
      ...prev,
      reports: prev.reports.filter(report => report.id !== id)
    }));
  };

  const contextValue: AppContextType = {
    state,
    selectInvestigator,
    updateInvestigator,
    logout,
    addPerson,
    updatePerson,
    deletePerson,
    addFaction,
    updateFaction,
    deleteFaction,
    addCase,
    updateCase,
    closeCase,
    deleteCase,
    addReport,
    updateReport,
    deleteReport,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};