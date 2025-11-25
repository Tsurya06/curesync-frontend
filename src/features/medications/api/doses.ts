import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DoseLog, LogDoseRequest } from '@/common/types/dose.types';
import { MOCK_DOSES } from '@/lib/mock-data';
import { isMockMode } from '@/lib/api-config';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';

// --- API Functions ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getDailySchedule = async (date: string, patientId?: number): Promise<DoseLog[]> => {
  if (isMockMode()) {
    await delay(500);
    // In mock mode, just return empty or static data for now as logic is complex
    return MOCK_DOSES;
  }

  const params: Record<string, string | number> = { date };
  if (patientId) params.patientId = patientId;

  return api.get<DoseLog[]>(API_ENDPOINTS.DOSES.SCHEDULE, { params });
};

const logDose = async ({ medicationId, ...data }: LogDoseRequest & { medicationId: number }): Promise<DoseLog> => {
  if (isMockMode()) {
    await delay(500);
    const newDose: DoseLog = {
      id: Date.now(),
      userId: 1,
      medicationId,
      medicationName: 'Mock Med',
      dosage: '10mg',
      scheduledTime: new Date().toISOString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_DOSES.push(newDose);
    return newDose;
  }
  return api.post<DoseLog>(API_ENDPOINTS.DOSES.LOG(String(medicationId)), data);
};

// --- Hooks ---

export const useDailySchedule = (date: string, patientId?: number | null) => {
  return useQuery({
    queryKey: ['doses', 'schedule', date, patientId],
    queryFn: () => getDailySchedule(date, patientId || undefined),
  });
};

export const useLogDose = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logDose,
    onSuccess: () => {
      // Invalidate and refetch all dose-related queries immediately
      queryClient.invalidateQueries({ queryKey: ['doses'], refetchType: 'all' });
    },
  });
};

// Deprecated or removed functions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useDoseHistory = (_medicationId?: number, _patientId?: number | null) => {
  // Placeholder to prevent breaking imports immediately, but should be removed
  return { data: [] as DoseLog[], isLoading: false };
};

export const useDeleteDose = () => {
  // Placeholder
  return { mutate: () => { } };
};
