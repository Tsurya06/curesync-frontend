import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DoseLog, LogDoseRequest, DoseStatus } from '@/common/types/dose.types';

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';

// --- API Functions ---


const getDailySchedule = async (date: string, patientId?: number): Promise<DoseLog[]> => {
  const params: Record<string, string | number> = { date };
  if (patientId) params.patientId = patientId;

  return api.get<DoseLog[]>(API_ENDPOINTS.DOSES.SCHEDULE, { params });
};

const logDose = async ({ medicationId, ...data }: LogDoseRequest & { medicationId: number }): Promise<DoseLog> => {
  return api.post<DoseLog>(API_ENDPOINTS.DOSES.LOG(String(medicationId)), data);
};

// --- Hooks ---

export const useDailySchedule = (date: string, patientId?: number | null) => {
  return useQuery({
    queryKey: ['doses', 'schedule', date, patientId ?? 'me'],
    queryFn: () => getDailySchedule(date, patientId || undefined),
  });
};

export const useLogDose = (patientId?: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logDose,
    onMutate: async (newDose) => {
      // Get today's date in local timezone
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;

      const queryKey = ['doses', 'schedule', todayString, patientId ?? 'me'];

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousSchedule = queryClient.getQueryData<DoseLog[]>(queryKey);

      // Optimistically update to the new value
      if (previousSchedule) {
        queryClient.setQueryData<DoseLog[]>(queryKey, (old) => {
          if (!old) return [];

          return old.map((dose) => {
            // Match by medicationId and scheduledTime (since we might not have the log ID yet if it's pending)
            // Note: scheduledTime in newDose might be undefined if not passed, but handleLogDose passes it.
            if (
              dose.medicationId === newDose.medicationId &&
              newDose.scheduledTime &&
              dose.scheduledTime === newDose.scheduledTime
            ) {
              return {
                ...dose,
                status: newDose.status,
                takenTime: newDose.takenTime,
                notes: newDose.notes,
              };
            }
            return dose;
          });
        });
      }

      // Return a context object with the snapshotted value
      return { previousSchedule, queryKey };
    },
    onSuccess: (data, _variables, context) => {
      // Update the cache with the actual server response
      if (context?.queryKey) {
        queryClient.setQueryData<DoseLog[]>(context.queryKey, (old) => {
          if (!old) return [data];

          return old.map((dose) => {
            // Match by ID if available, or by medicationId/scheduledTime
            if (dose.id === data.id || (dose.medicationId === data.medicationId && dose.scheduledTime === data.scheduledTime)) {
              return data;
            }
            return dose;
          });
        });
      }

      // Refetch schedule to sync with backend (history will be fetched when modal opens)
      queryClient.invalidateQueries({ queryKey: ['doses', 'schedule'] });
    },
    onError: (_err, _newDose, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSchedule) {
        queryClient.setQueryData(context.queryKey, context.previousSchedule);
      }
      toast.error('Failed to log dose');

      // Refetch to get the correct state from server
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};

// Get dose history for a specific medication
const getDoseHistory = async (medicationId: number, patientId?: number): Promise<DoseLog[]> => {
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

export const useDeleteDose = (patientId?: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doseId, medicationId, scheduledTime }: { doseId: number; medicationId: number; scheduledTime: string }) => {
      // Instead of DELETE, we re-log the dose as PENDING to undo it
      return api.post<DoseLog>(API_ENDPOINTS.DOSES.LOG(String(medicationId)), {
        status: DoseStatus.PENDING,
        takenTime: new Date().toISOString(),
        scheduledTime: scheduledTime,
      });
    },
    onMutate: async ({ doseId }) => {
      // Get today's date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;

      const queryKey = ['doses', 'schedule', todayString, patientId ?? 'me'];

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousSchedule = queryClient.getQueryData<DoseLog[]>(queryKey);

      // Optimistically change status back to PENDING
      if (previousSchedule) {
        queryClient.setQueryData<DoseLog[]>(queryKey, (old) => {
          if (!old) return [];
          return old.map((dose) => {
            if (dose.id === doseId) {
              return { ...dose, status: DoseStatus.PENDING, takenTime: undefined };
            }
            return dose;
          });
        });
      }

      return { previousSchedule, queryKey };
    },
    onSuccess: (data, _variables, context) => {
      // Update cache with server response
      if (context?.queryKey) {
        queryClient.setQueryData<DoseLog[]>(context.queryKey, (old) => {
          if (!old) return [data];
          return old.map((dose) => {
            if (dose.medicationId === data.medicationId && dose.scheduledTime === data.scheduledTime) {
              return data;
            }
            return dose;
          });
        });
      }
      toast.success('Dose unmarked successfully');

      // Invalidate history so modal shows correct state
      queryClient.invalidateQueries({ queryKey: ['doses', 'history'] });
    },
    onError: (_err, _variables, context) => {
      // Roll back on error
      if (context?.previousSchedule) {
        queryClient.setQueryData(context.queryKey, context.previousSchedule);
      }
      toast.error('Failed to undo dose');

      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};
