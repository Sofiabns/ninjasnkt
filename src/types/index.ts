// NINJAS NKT - Data Types

export interface Investigator {
  id: string;
  name: string;
  photo: string;
  createdAt: string;
}

export interface Person {
  id: string; // P-01, P-02, etc.
  name: string;
  photo: string;
  phone: string;
  vehiclePlate: string;
  vehicleModel: string;
  faction: string;
  role: 'Líder' | 'Sub-Líder' | 'Membro' | 'Associado' | 'Informante' | 'Suspeito';
  createdAt: string;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  members: string[]; // Person IDs
  createdAt: string;
}

export interface Case {
  id: string; // C-01, C-02, etc.
  title: string;
  description: string;
  peopleInvolved: string[]; // Person IDs
  vehiclePlate?: string;
  vehicleModel?: string;
  status: 'Aberto' | 'Fechado';
  closingReason?: string;
  investigatorId: string;  
  createdAt: string;
  closedAt?: string;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  peopleInvolved: string[]; // Person IDs
  attachments: Attachment[];
  investigatorId: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  name: string;
  file?: File;
}

export interface AppState {
  investigators: Investigator[];
  people: Person[];
  factions: Faction[];
  cases: Case[];
  reports: Report[];
  currentInvestigator: string | null;
}