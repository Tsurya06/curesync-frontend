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

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';



// --- API Functions ---

const getCaregivers = async (): Promise<Caregiver[]> => {

  return api.get<{ caregivers: Caregiver[] }>(API_ENDPOINTS.CAREGIVERS.MY_CAREGIVERS).then(res => res.caregivers);
};

const getPatients = async (): Promise<Patient[]> => {
  return api.get<{ patients: Patient[] }>(API_ENDPOINTS.CAREGIVERS.PATIENTS).then(res => res.patients);
};

const getInvites = async (): Promise<CaregiverInvite[]> => {

  // Note: API doesn't explicitly list an endpoint for sent invites, assuming it might be part of relationships or a separate endpoint not fully detailed
  // For now, we'll use a placeholder or assume it's not implemented yet in backend
  return [];
};

const getReceivedInvites = async (): Promise<CaregiverInvite[]> => {
  // Assuming there's an endpoint for this, though not explicitly in the list provided. 
  // The list has "List Patients" and "List Caregivers". 
  // We might need to clarify this. For now, we'll assume it's under invitations.
  return [];
};

const createInvite = async (data: CreateInviteRequest): Promise<CaregiverInvite> => {
  return api.post<CaregiverInvite>(API_ENDPOINTS.CAREGIVERS.INVITE, data);
};

const acceptInvite = async (data: AcceptInviteRequest): Promise<CaregiverInvite> => {
  return api.post<CaregiverInvite>(API_ENDPOINTS.CAREGIVERS.ACCEPT(String(data.inviteId)));
};

const rejectInvite = async (data: RejectInviteRequest): Promise<CaregiverInvite> => {
  return api.post<CaregiverInvite>(API_ENDPOINTS.CAREGIVERS.REJECT(String(data.inviteId)));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCaregiverPermissions = async (_patientId: number): Promise<CaregiverPermission[]> => {
  // Assuming endpoint exists or using a placeholder
  return [];
};

const removeCaregiver = async (id: number): Promise<void> => {
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
