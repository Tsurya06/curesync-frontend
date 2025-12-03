export enum DoseStatus {
  PENDING = 'PENDING',
  TAKEN = 'TAKEN',
  SKIPPED = 'SKIPPED',
  MISSED = 'MISSED',
}

export interface DoseLog {
  id: number;
  userId: number;
  medicationId: number;
  medicationName: string;
  dosage: string;
  scheduledTime: string; // ISO 8601
  takenTime?: string; // ISO 8601
  status: DoseStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogDoseRequest {
  doseId: number;
  status: DoseStatus;
  takenTime: string;
  scheduledTime?: string;
  notes?: string;
}
