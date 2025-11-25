export interface AdherenceStats {
  overallAdherence: number;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  skippedDoses: number;
  startDate: string;
  endDate: string;
  medicationBreakdown: {
    medicationId: number;
    medicationName: string;
    adherence: number;
    totalDoses: number;
    takenDoses: number;
  }[];
}

export interface AdherenceTrend {
  dailyAdherence: Record<string, number>;
  dates: string[];
  adherenceValues: number[];
}

export interface AdherenceRequest {
  startDate: string;
  endDate: string;
  patientId?: number;
}
