import { Plus, Edit2, Trash2, Clock, Bell, Check, X, History, User } from 'lucide-react';
import { ErrorState } from '@/components/shared/ErrorState';
import { useTranslation } from 'react-i18next';
import { format, isToday, isTomorrow, parseISO, isSameMinute } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useMedications, useDeleteMedication } from '@/features/medications/api';
import { useLogDose, useDailySchedule } from '@/features/medications/api/doses';
import { DoseStatus } from '@/common/types/dose.types';
import { useState, useEffect, useRef } from 'react';
import { DeleteConfirmation } from './DeleteConfirmation';
import { DoseHistoryModal } from './DoseHistoryModal';
import { useDoseScheduler } from '../hooks/useDoseScheduler';
import { NotificationService } from '@/lib/services/notification-service';
import { cn } from '@/lib/utils';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { toast } from 'sonner';
import { useCaregiver } from '@/features/caregivers/context/CaregiverContext';
import { CaregiverPermission } from '@/common/types/caregiver.types';

export default function MedicationList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramHighlightId = searchParams.get('highlight');

  // Caregiver Context
  const { isCaregiver, hasPermission, currentPatientId } = useCaregiver();
  const canManage = !isCaregiver || hasPermission(CaregiverPermission.MANAGE_MEDICATIONS);
  const canLogDose = !isCaregiver || hasPermission(CaregiverPermission.LOG_DOSES);
  const canViewHistory = !isCaregiver || hasPermission(CaregiverPermission.VIEW_HISTORY);

  const { data: medications, isLoading, isError } = useMedications(currentPatientId);
  // Using today's date for schedule check, in real app might need date selection
  const today = new Date().toISOString().split('T')[0];
  const { data: dailySchedule } = useDailySchedule(today, currentPatientId);

  const { mutate: logDose } = useLogDose();
  const { mutate: deleteMedication } = useDeleteMedication(); // Use correct hook
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [historyId, setHistoryId] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Refs for scrolling
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scheduler Hook
  const { upcomingDoses } = useDoseScheduler(medications || []);

  // Request notification permission on mount
  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

  // Schedule notifications for upcoming doses
  useEffect(() => {
    upcomingDoses.forEach((dose) => {
      NotificationService.scheduleNotification(
        String(dose.medication.id),
        dose.scheduledTime,
        t('medications.notifications.timeToTake', { name: dose.medication.name }),
        t('medications.notifications.dosage', { dosage: dose.medication.dosage })
      );
    });
  }, [upcomingDoses, t]);

  // Handle highlight logic
  useEffect(() => {
    if (paramHighlightId && !isLoading && medications) {
      const highlightIdNum = Number(paramHighlightId);
      // Set local highlight
      setHighlightedId(highlightIdNum);

      // Scroll to element
      const element = cardRefs.current[paramHighlightId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Remove param from URL without reload
      setSearchParams(params => {
        params.delete('highlight');
        return params;
      }, { replace: true });

      // Auto-clear after 2 seconds
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [paramHighlightId, isLoading, medications, setSearchParams]);

  // Clear highlight on any click
  useEffect(() => {
    const handleGlobalClick = () => {
      if (highlightedId) {
        setHighlightedId(null);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [highlightedId]);

  const handleLogDose = (medicationId: number, status: DoseStatus, scheduledTime: Date) => {
    logDose({
      medicationId,
      status,
      scheduledTime: scheduledTime.toISOString(),
      takenTime: new Date().toISOString(),
    }, {
      onSuccess: () => {
        toast.success(
          status === DoseStatus.TAKEN ? t('medications.doseTaken') : t('medications.doseSkipped')
        );
      },
      onError: () => {
        toast.error(t('common.error'));
      }
    });
  };

  const getDoseStatus = (medId: number, scheduledTime?: Date) => {
    if (!dailySchedule || !scheduledTime) return null;

    // Find a log entry that matches the medication ID and the scheduled time
    return dailySchedule.find(log => {
      const idsMatch = log.medicationId === medId;
      const timesMatch = isSameMinute(parseISO(log.scheduledTime), scheduledTime);
      return idsMatch && timesMatch;
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        pageTitle={t('medications.title')}
        pageSubtitle={t('medications.subtitle')}
        showHeader={true}
        title={t('medications.error.title', 'Failed to Load')}
        message={t('medications.error.message', 'Failed to load medications. Please try again.')}
      />
    );
  }

  if (!medications?.length) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{t('medications.emptyTitle')}</h3>
        <p className="text-muted-foreground mb-4">{t('medications.emptyDesc')}</p>
        {canManage && (
          <Button onClick={() => navigate('/medications/new')}>
            {t('medications.add')}
          </Button>
        )}
      </div>
    );
  }

  const getNextDoseDisplay = (medId: number) => {
    const next = upcomingDoses.find(d => d.medication.id === medId);
    if (!next) return t('medications.notScheduled');

    const date = next.scheduledTime;
    const timeStr = format(date, 'h:mm a');

    if (isToday(date)) return `${t('medications.dateHelpers.today')}, ${timeStr}`;
    if (isTomorrow(date)) return `${t('medications.dateHelpers.tomorrow')}, ${timeStr}`;
    return format(date, 'MMM d, h:mm a');
  };

  const getNextDoseDate = (medId: number) => {
    const next = upcomingDoses.find(d => d.medication.id === medId);
    return next?.scheduledTime;
  };

  return (
    <div className="space-y-6">
      {/* Caregiver Banner */}
      {isCaregiver && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3 text-blue-800">
          <User className="h-5 w-5" />
          <span className="font-medium">
            {t('caregivers.viewingAs', { patientName: t('analytics.patient') })}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('medications.title')}</h2>
        {canManage && (
          <Button onClick={() => navigate('/medications/new')}>
            <Plus className="mr-2 h-4 w-4" /> {t('medications.add')}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medications.map((medication) => {
          const isHighlighted = highlightedId === medication.id;
          const nextDoseDate = getNextDoseDate(medication.id);
          const doseStatus = getDoseStatus(medication.id, nextDoseDate);

          return (
            <div
              key={medication.id}
              ref={(el) => (cardRefs.current[String(medication.id)] = el)}
              className={cn(
                "transition-all duration-500 rounded-xl",
                isHighlighted && "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg"
              )}
            >
              <Card className="group relative overflow-hidden transition-all hover:shadow-md h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{medication.name}</CardTitle>
                      <Badge variant="secondary" className="font-normal">
                        {medication.dosage}
                      </Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canLogDose && (
                        !doseStatus ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title={t('medications.take')}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (nextDoseDate) {
                                  handleLogDose(medication.id, DoseStatus.TAKEN, nextDoseDate);
                                }
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              title={t('medications.skip')}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (nextDoseDate) {
                                  handleLogDose(medication.id, DoseStatus.SKIPPED, nextDoseDate);
                                }
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          // Undo functionality removed for now as deleteDose is not fully supported in new API for logs
                          <div className="h-8 w-8" />
                        )
                      )}

                      {canViewHistory && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title={t('medications.history')}
                          onClick={(e) => {
                            e.stopPropagation();
                            setHistoryId(medication.id);
                          }}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      )}

                      {canManage && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/medications/${medication.id}/edit`);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(medication.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{t(`medications.frequencies.${medication.frequency}`)}</span>
                    </div>

                    <div className={cn(
                      "flex items-center font-medium p-2 rounded-md transition-colors",
                      isHighlighted ? "bg-primary/10 text-primary animate-pulse" : "bg-primary/5 text-primary"
                    )}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>
                        {t('medications.nextDose')}: {' '}
                        {doseStatus ? (
                          <span className={cn(
                            "font-semibold",
                            doseStatus.status === DoseStatus.TAKEN ? "text-green-600" : "text-amber-600"
                          )}>
                            {doseStatus.status === DoseStatus.TAKEN ? t('medications.taken') : t('medications.skipped')}
                            {' '}({doseStatus.takenTime ? format(parseISO(doseStatus.takenTime), 'h:mm a') : ''})
                          </span>
                        ) : (
                          isHighlighted && nextDoseDate ? (
                            <CountdownTimer targetDate={nextDoseDate} className="font-bold" />
                          ) : (
                            getNextDoseDisplay(medication.id)
                          )
                        )}
                      </span>
                    </div>

                    {medication.notes && (
                      <p className="text-muted-foreground line-clamp-2 mt-2 pt-2 border-t">
                        {medication.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMedication(deleteId);
          setDeleteId(null);
        }}
        medicationId={deleteId}
      />

      <DoseHistoryModal
        open={!!historyId}
        onOpenChange={(open) => !open && setHistoryId(null)}
        medicationId={historyId}
      />
    </div>
  );
}
