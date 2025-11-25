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
    onSuccess: (data) => {
      // Get today's date in local timezone
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;

      // Optimistically update the daily schedule cache
      queryClient.setQueryData(['doses', 'schedule', todayString, undefined], (old: DoseLog[] | undefined) => {
        if (!old) return [data];

        // Check if this dose already exists (by id)
        const existingIndex = old.findIndex(d => d.id === data.id);
        if (existingIndex >= 0) {
          // Update existing
          const newData = [...old];
          newData[existingIndex] = data;
          return newData;
        }

        // Add new dose
        return [...old, data];
      });

      // Also invalidate to refetch in background
      queryClient.invalidateQueries({ queryKey: ['doses'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
};

// Get dose history for a specific medication
const getDoseHistory = async (medicationId: number, patientId?: number): Promise<DoseLog[]> => {
  if (isMockMode()) {
    await delay(500);
    // Filter mock doses by medication ID
    return MOCK_DOSES.filter(dose => dose.medicationId === medicationId);
  }

  const params: Record<string, string | number> = { medicationId };
  if (patientId) params.patientId = patientId;

  return api.get<DoseLog[]>(API_ENDPOINTS.DOSES.HISTORY, { params });
};

export const useDoseHistory = (medicationId?: number, patientId?: number | null) => {
  return useQuery({
    queryKey: ['doses', 'history', medicationId, patientId],
    queryFn: () => getDoseHistory(medicationId!, patientId || undefined),
    enabled: !!medicationId, // Only fetch if medication ID is provided
  });
};

export const useDeleteDose = () => {
  // Placeholder
  return { mutate: () => { } };
};
