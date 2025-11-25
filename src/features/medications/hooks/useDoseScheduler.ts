import { useMemo } from 'react';
import { Medication } from '@/common/types/medication.types';

export interface ScheduledDose {
  medication: Medication;
  scheduledTime: Date;
}

export function useDoseScheduler(medications: Medication[]) {
  const upcomingDoses = useMemo(() => {
    const doses: ScheduledDose[] = [];
    const now = new Date();

    medications.forEach((medication) => {
      if (!medication.timesOfDay || medication.timesOfDay.length === 0) {
        return;
      }

      medication.timesOfDay.forEach((time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (scheduledTime < now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        doses.push({
          medication,
          scheduledTime,
        });
      });
    });

    // Sort by scheduled time (earliest first)
    return doses.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }, [medications]);

  return { upcomingDoses };
}
