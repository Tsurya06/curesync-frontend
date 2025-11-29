import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';
import {
  Medication,
  CreateMedicationRequest,
  UpdateMedicationRequest,
} from '@/common/types/medication.types';


// Extend queryKeys for medications
const medicationKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationKeys.all, 'list'] as const,
  list: (filters: string) => [...medicationKeys.lists(), { filters }] as const,
  details: () => [...medicationKeys.all, 'detail'] as const,
  detail: (id: number) => [...medicationKeys.details(), id] as const,
};



/**
 * Hook to fetch all medications
 */
export function useMedications(patientId?: number | null) {
  return useQuery({
    queryKey: medicationKeys.list(patientId ? String(patientId) : 'me'),
    queryFn: async () => {


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

/**
 * Upload medication image
 */
const uploadMedicationImage = async ({ id, file }: { id: number; file: File }) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<Medication>(API_ENDPOINTS.MEDICATIONS.UPLOAD_IMAGE(String(id)), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Hook to upload medication image
 */
export function useUploadMedicationImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadMedicationImage,
    onSuccess: (data) => {
      toast.success('Medication image updated successfully');
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.detail(data.id) });
    },
    onError: () => {
      toast.error('Failed to upload medication image');
    },
  });
}
