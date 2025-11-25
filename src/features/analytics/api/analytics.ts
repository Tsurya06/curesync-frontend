import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { AdherenceStats, AdherenceTrend } from '@/common/types/analytics.types';
import { isMockMode } from '@/lib/api-config';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAdherenceStats = async (startDate: string, endDate: string, patientId?: number): Promise<AdherenceStats> => {
    if (isMockMode()) {
        await delay(500);
        return {
            overallAdherence: 85.5,
            totalDoses: 100,
            takenDoses: 85,
            missedDoses: 10,
            skippedDoses: 5,
            startDate,
            endDate,
            medicationBreakdown: [
                {
                    medicationId: 1,
                    medicationName: "Aspirin",
                    adherence: 90.0,
                    totalDoses: 50,
                    takenDoses: 45
                },
                {
                    medicationId: 2,
                    medicationName: "Metformin",
                    adherence: 80.0,
                    totalDoses: 50,
                    takenDoses: 40
                }
            ]
        };
    }
    const params: Record<string, string | number> = { startDate, endDate };
    if (patientId) params.patientId = patientId;
    return api.get<AdherenceStats>(API_ENDPOINTS.ANALYTICS.ADHERENCE, { params });
};

const getAdherenceTrend = async (startDate: string, endDate: string, patientId?: number): Promise<AdherenceTrend> => {
    if (isMockMode()) {
        await delay(500);
        return {
            dailyAdherence: {
                "2025-11-01": 100.0,
                "2025-11-02": 90.0,
                "2025-11-03": 80.0,
                "2025-11-04": 85.0,
                "2025-11-05": 95.0
            },
            dates: ["2025-11-01", "2025-11-02", "2025-11-03", "2025-11-04", "2025-11-05"],
            adherenceValues: [100.0, 90.0, 80.0, 85.0, 95.0]
        };
    }
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
