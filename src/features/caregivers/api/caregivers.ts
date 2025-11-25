import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Caregiver,
  CaregiverInvite,
  CreateInviteRequest,
  AcceptInviteRequest,
  RejectInviteRequest,
  InviteStatus,
  Patient,
  CaregiverPermission,
} from '@/common/types/caregiver.types';
import { MOCK_CAREGIVERS, MOCK_INVITES } from '@/lib/mock-data';
import { isMockMode } from '@/lib/api-config';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';

// Helper for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API Functions ---

const getCaregivers = async (): Promise<Caregiver[]> => {
  if (isMockMode()) {
    await delay(500);
    return MOCK_CAREGIVERS;
  }
  return api.get<{ caregivers: Caregiver[] }>(API_ENDPOINTS.CAREGIVERS.MY_CAREGIVERS).then(res => res.caregivers);
};

const getPatients = async (): Promise<Patient[]> => {
  if (isMockMode()) {
    await delay(500);
    // Return mock patients with permissions
    return [
      {
        id: 101,
        email: 'patient1@example.com',
        firstName: 'Alice',
        lastName: 'Smith',
        role: 'PATIENT',
        permissions: [CaregiverPermission.VIEW_MEDICATIONS, CaregiverPermission.LOG_DOSES],
        createdAt: new Date().toISOString()
      }
    ];
  }
  return api.get<{ patients: Patient[] }>(API_ENDPOINTS.CAREGIVERS.PATIENTS).then(res => res.patients);
};

const getInvites = async (): Promise<CaregiverInvite[]> => {
  if (isMockMode()) {
    await delay(500);
    return MOCK_INVITES;
  }
  // Note: API doesn't explicitly list an endpoint for sent invites, assuming it might be part of relationships or a separate endpoint not fully detailed
  // For now, we'll use a placeholder or assume it's not implemented yet in backend
  return [];
};

const getReceivedInvites = async (): Promise<CaregiverInvite[]> => {
  if (isMockMode()) {
    await delay(500);
    return MOCK_INVITES.filter(inv => inv.status === InviteStatus.PENDING);
  }
  // Assuming there's an endpoint for this, though not explicitly in the list provided. 
  // The list has "List Patients" and "List Caregivers". 
  // We might need to clarify this. For now, we'll assume it's under invitations.
  return [];
};

const createInvite = async (data: CreateInviteRequest): Promise<CaregiverInvite> => {
  if (isMockMode()) {
    await delay(800);
    const newInvite: CaregiverInvite = {
      id: Date.now(),
      patient: {
        id: 1,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'PATIENT',
      },
      caregiver: {
        id: 2,
        email: 'caregiver@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'CAREGIVER',
      },
      permissions: [CaregiverPermission.VIEW_MEDICATIONS],
      status: InviteStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_INVITES.push(newInvite);
    return newInvite;
  }
  return api.post<CaregiverInvite>(API_ENDPOINTS.CAREGIVERS.INVITE, data);
};

const acceptInvite = async (data: AcceptInviteRequest): Promise<CaregiverInvite> => {
  if (isMockMode()) {
    await delay(800);
    const invite = MOCK_INVITES.find(inv => inv.id === data.inviteId);
    if (!invite) throw new Error('Invite not found');

    invite.status = InviteStatus.ACCEPTED;
    invite.updatedAt = new Date().toISOString();
    return invite;
  }
  return api.post<CaregiverInvite>(API_ENDPOINTS.CAREGIVERS.ACCEPT(String(data.inviteId)));
};

const rejectInvite = async (data: RejectInviteRequest): Promise<CaregiverInvite> => {
  if (isMockMode()) {
    await delay(500);
    const invite = MOCK_INVITES.find(inv => inv.id === data.inviteId);
    if (invite) {
      invite.status = InviteStatus.REJECTED;
      invite.updatedAt = new Date().toISOString();
      return invite;
    }
    throw new Error('Invite not found');
  }
  return api.post<CaregiverInvite>(API_ENDPOINTS.CAREGIVERS.REJECT(String(data.inviteId)));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCaregiverPermissions = async (_patientId: number): Promise<CaregiverPermission[]> => {
  if (isMockMode()) {
    await delay(300);
    // Mock permissions
    return [
      CaregiverPermission.VIEW_MEDICATIONS,
      CaregiverPermission.LOG_DOSES,
      CaregiverPermission.VIEW_HISTORY
    ];
  }
  // Assuming endpoint exists or using a placeholder
  return [];
};

const removeCaregiver = async (id: number): Promise<void> => {
  if (isMockMode()) {
    await delay(500);
    const index = MOCK_CAREGIVERS.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_CAREGIVERS.splice(index, 1);
    }
    return;
  }
  return api.delete(API_ENDPOINTS.CAREGIVERS.REMOVE(String(id)));
};

// --- Hooks ---

export const useCaregivers = () => {
  return useQuery({
    queryKey: ['caregivers'],
    queryFn: getCaregivers,
  });
};

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  });
};

export const useInvites = () => {
  return useQuery({
    queryKey: ['invites'],
    queryFn: getInvites,
  });
};

export const useReceivedInvites = () => {
  return useQuery({
    queryKey: ['receivedInvites'],
    queryFn: getReceivedInvites,
  });
};

export const useCaregiverPermissions = (patientId: number | null) => {
  return useQuery({
    queryKey: ['caregiverPermissions', patientId],
    queryFn: () => getCaregiverPermissions(patientId!),
    enabled: !!patientId,
  });
};

export const useCreateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      toast.success('Invite sent successfully');
    },
    onError: () => {
      toast.error('Failed to send invite');
    },
  });
};

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivedInvites'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Invite accepted');
    },
    onError: () => {
      toast.error('Failed to accept invite');
    },
  });
};

export const useRejectInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivedInvites'] });
      toast.success('Invite rejected');
    },
    onError: () => {
      toast.error('Failed to reject invite');
    },
  });
};

export const useRemoveCaregiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCaregiver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caregivers'] });
      toast.success('Caregiver removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove caregiver');
    },
  });
};
