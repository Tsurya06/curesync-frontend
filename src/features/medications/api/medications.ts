import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';
import {
  Medication,
  CreateMedicationRequest,
  UpdateMedicationRequest,
} from '@/common/types/medication.types';
import { MOCK_MEDICATIONS } from '@/lib/mock-data';
import { isMockMode } from '@/lib/api-config';

// Extend queryKeys for medications
const medicationKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationKeys.all, 'list'] as const,
  list: (filters: string) => [...medicationKeys.lists(), { filters }] as const,
  details: () => [...medicationKeys.all, 'detail'] as const,
  detail: (id: number) => [...medicationKeys.details(), id] as const,
};

// Helper for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Hook to fetch all medications
 */
export function useMedications(patientId?: number | null) {
  return useQuery({
    queryKey: medicationKeys.list(patientId ? String(patientId) : 'me'),
    queryFn: async () => {
      if (isMockMode()) {
        await delay(800);
        // If viewing a patient, return a subset or different mock data
        if (patientId) {
          return MOCK_MEDICATIONS.slice(0, 3).map(m => ({
            ...m,
            userId: patientId // Pretend these belong to the patient
          }));
        }
        return MOCK_MEDICATIONS;
      }

      // Real API call
      const endpoint = patientId
        ? `/api/medications?patientId=${patientId}` // Use query parameter as per API spec
        : API_ENDPOINTS.MEDICATIONS.BASE;

      // Backend returns paginated response: { medications: [...], total, page, limit, totalPages }
      const response = await api.get<{ medications: Medication[] }>(endpoint);

      // Extract medications array from paginated response and filter out ARCHIVED ones
      const allMedications = response.medications || [];
      return allMedications.filter(med => med.status !== 'ARCHIVED');
    },
  });
}

/**
 * Hook to fetch a single medication
 */
export function useMedication(id: number) {
  return useQuery({
    queryKey: medicationKeys.detail(id),
    queryFn: async () => {
      if (isMockMode()) {
        await delay(500);
        const med = MOCK_MEDICATIONS.find(m => m.id === id);
        if (!med) throw new Error('Medication not found');
        return med;
      }
      return api.get<Medication>(API_ENDPOINTS.MEDICATIONS.BY_ID(String(id)));
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a medication
 */
export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMedicationRequest) => {
      if (isMockMode()) {
        await delay(800);
        const newMed = {
          ...data,
          id: Date.now(),
          userId: 1,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Medication;
        MOCK_MEDICATIONS.push(newMed);
        return newMed;
      }
      return api.post<Medication>(API_ENDPOINTS.MEDICATIONS.BASE, data);
    },
    onSuccess: () => {
      toast.success('Medication added successfully');
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add medication');
    },
  });
}

/**
 * Hook to update a medication
 */
export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateMedicationRequest) => {
      if (isMockMode()) {
        await delay(800);
        const index = MOCK_MEDICATIONS.findIndex(m => m.id === id);
        if (index === -1) throw new Error('Medication not found');

        const updatedMed = {
          ...MOCK_MEDICATIONS[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        MOCK_MEDICATIONS[index] = updatedMed;
        return updatedMed;
      }
      return api.put<Medication>(API_ENDPOINTS.MEDICATIONS.BY_ID(String(id)), data);
    },
    onSuccess: (data) => {
      toast.success('Medication updated successfully');
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.detail(data.id) });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update medication');
    },
  });
}

/**
 * Hook to delete a medication
 */
export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (isMockMode()) {
        await delay(800);
        const index = MOCK_MEDICATIONS.findIndex(m => m.id === id);
        if (index !== -1) {
          MOCK_MEDICATIONS.splice(index, 1);
        }
        return;
      }
      return api.delete(API_ENDPOINTS.MEDICATIONS.BY_ID(String(id)));
    },
    onSuccess: () => {
      toast.success('Medication deleted successfully');
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete medication');
    },
  });
}
