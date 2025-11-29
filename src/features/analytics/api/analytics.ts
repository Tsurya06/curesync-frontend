import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { AdherenceStats, AdherenceTrend } from '@/common/types/analytics.types';


const getAdherenceStats = async (startDate: string, endDate: string, patientId?: number): Promise<AdherenceStats> => {
    const params: Record<string, string | number> = { startDate, endDate };
    if (patientId) params.patientId = patientId;
    return api.get<AdherenceStats>(API_ENDPOINTS.ANALYTICS.ADHERENCE, { params });
};

const getAdherenceTrend = async (startDate: string, endDate: string, patientId?: number): Promise<AdherenceTrend> => {
    const params: Record<string, string | number> = { startDate, endDate };
    if (patientId) params.patientId = patientId;
    return api.get<AdherenceTrend>(API_ENDPOINTS.ANALYTICS.TRENDS, { params });
};

export const useAdherenceStats = (startDate: string, endDate: string, patientId?: number | null) => {
    return useQuery({
        queryKey: ['analytics', 'adherence', startDate, endDate, patientId],
        queryFn: () => getAdherenceStats(startDate, endDate, patientId || undefined),
    });
};

export const useAdherenceTrend = (startDate: string, endDate: string, patientId?: number | null) => {
    return useQuery({
        queryKey: ['analytics', 'trends', startDate, endDate, patientId],
        queryFn: () => getAdherenceTrend(startDate, endDate, patientId || undefined),
    });
};
