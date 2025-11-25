import { DoseStatus, DoseLog } from '@/common/types/dose.types';

import { subDays, isSameDay, format, eachDayOfInterval } from 'date-fns';

export interface DailyAdherence {
    date: string;
    dateObj: Date;
    totalScheduled: number;
    taken: number;
    skipped: number;
    missed: number;
    score: number; // 0-100
}

export interface AdherenceStats {
    currentStreak: number;
    bestStreak: number;
    overallScore: number;
    totalDosesLogged: number;
    weeklyTrend: DailyAdherence[];
}

/**
 * Calculates adherence statistics based on dose history and medication schedules
 */
export const calculateAdherenceStats = (
    logs: DoseLog[] | undefined,
    daysToAnalyze = 30
): AdherenceStats => {
    // Defensive check: ensure logs is an array
    if (!logs || !Array.isArray(logs)) {
        return {
            currentStreak: 0,
            bestStreak: 0,
            overallScore: 0,
            totalDosesLogged: 0,
            weeklyTrend: []
        };
    }

    const today = new Date();
    const startDate = subDays(today, daysToAnalyze - 1);
    const dateRange = eachDayOfInterval({ start: startDate, end: today });

    // 1. Calculate daily stats
    const dailyStats: DailyAdherence[] = dateRange.map(date => {

        // Find logs for this day
        const dayLogs = logs.filter(log => {
            const logDate = new Date(log.scheduledTime);
            return isSameDay(logDate, date);
        });

        // Count statuses
        const taken = dayLogs.filter(l => l.status === DoseStatus.TAKEN).length;
        const skipped = dayLogs.filter(l => l.status === DoseStatus.SKIPPED).length;

        // Estimate total scheduled based on active medications
        // Note: This is a simplified estimation. In a real app, we'd generate exact schedules.
        // For now, we assume if a log exists, it was scheduled. 
        // Plus we count missed doses if we have logic for them, but for now we'll rely on logs.
        // To make this more robust, we'd need to generate "expected" doses for past days.
        // For this MVP, we'll calculate score based on logged interactions vs expected if available,
        // or just taken / (taken + skipped + missed).

        // Simplified: Total = Taken + Skipped + (Missed if we had them)
        // For MVP, let's assume Total = Taken + Skipped for historical data if we don't have "missed" logs.
        // If we want to show missed, we need to know what SHOULD have happened.

        const total = taken + skipped; // + missed
        const score = total > 0 ? Math.round((taken / total) * 100) : 0;

        return {
            date: format(date, 'MMM d'),
            dateObj: date,
            totalScheduled: total,
            taken,
            skipped,
            missed: 0, // Placeholder
            score
        };
    });

    // 2. Calculate Streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Iterate from oldest to newest for best streak
    dailyStats.forEach(day => {
        if (day.score === 100 && day.totalScheduled > 0) {
            tempStreak++;
        } else if (day.totalScheduled > 0) { // Only break streak if there were doses scheduled
            bestStreak = Math.max(bestStreak, tempStreak);
            tempStreak = 0;
        }
    });
    bestStreak = Math.max(bestStreak, tempStreak);

    // Calculate current streak (working backwards from today)
    // We only count "yesterday" if today hasn't happened yet or is partial
    // For simplicity, let's look at the reversed array
    const reversedStats = [...dailyStats].reverse();
    for (const day of reversedStats) {
        // If today has no doses yet, skip it for streak calculation
        if (isSameDay(day.dateObj, today) && day.totalScheduled === 0) continue;

        if (day.score === 100 && day.totalScheduled > 0) {
            currentStreak++;
        } else if (day.totalScheduled > 0) {
            break;
        }
    }

    // 3. Overall Score (Average of daily scores where doses existed)
    const activeDays = dailyStats.filter(d => d.totalScheduled > 0);
    const totalScore = activeDays.reduce((acc, day) => acc + day.score, 0);
    const overallScore = activeDays.length > 0 ? Math.round(totalScore / activeDays.length) : 0;

    return {
        currentStreak,
        bestStreak,
        overallScore,
        totalDosesLogged: logs.length,
        weeklyTrend: dailyStats.slice(-7) // Last 7 days
    };
};
