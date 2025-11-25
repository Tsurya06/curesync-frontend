export enum CaregiverPermission {
  VIEW_MEDICATIONS = 'VIEW_MEDICATIONS',
  MANAGE_MEDICATIONS = 'MANAGE_MEDICATIONS',
  LOG_DOSES = 'LOG_DOSES',
  VIEW_HISTORY = 'VIEW_HISTORY',
}

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface CaregiverInvite {
  id: number;
  caregiver: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CAREGIVER';
  };
  patient: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'PATIENT';
  };
  permissions: CaregiverPermission[];
  status: InviteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Caregiver {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CAREGIVER';
  permissions?: CaregiverPermission[]; // Permissions granted to this caregiver (when viewing as patient)
  createdAt?: string; // When the caregiver relationship was established
}

export interface Patient {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT';
  permissions?: CaregiverPermission[];
  createdAt?: string; // Relationship start date
}

export interface CreateInviteRequest {
  patientEmail: string;
}

export interface UpdateCaregiverRequest {
  permissions: CaregiverPermission[];
  isActive?: boolean;
}

export interface AcceptInviteRequest {
  inviteId: number;
}

export interface RejectInviteRequest {
  inviteId: number;
}
