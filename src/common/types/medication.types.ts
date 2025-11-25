export enum Frequency {
  ONCE_DAILY = 'ONCE_DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  EVERY_8_HOURS = 'EVERY_8_HOURS',
  EVERY_12_HOURS = 'EVERY_12_HOURS',
  EVERY_OTHER_DAY = 'EVERY_OTHER_DAY',
  WEEKLY = 'WEEKLY',
  CUSTOM = 'CUSTOM',
}

export interface Medication {
  id: number;
  userId: number;
  name: string;
  dosage: string;
  frequency: Frequency;
  startDate: string; // ISO Date string
  endDate?: string; // ISO Date string
  timesOfDay: string[]; // Array of time strings "HH:mm"
  notes?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationRequest {
  name: string;
  dosage: string;
  frequency: Frequency;
  timesOfDay: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface UpdateMedicationRequest extends Partial<CreateMedicationRequest> {
  id: number;
}
