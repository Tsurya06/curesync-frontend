import { Plus, Edit2, Trash2, Clock, Bell, Check, X, History, User, Undo } from 'lucide-react';
import { SecureImage } from '@/components/shared/SecureImage';
import { ErrorState } from '@/components/shared/ErrorState';
import { useTranslation } from 'react-i18next';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMedications, useDeleteMedication } from '@/features/medications/api';
import { useLogDose, useDailySchedule, useDeleteDose } from '@/features/medications/api/doses';
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

  // Get today's date in YYYY-MM-DD format using LOCAL timezone (not UTC)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  const { data: dailySchedule } = useDailySchedule(todayString, currentPatientId);
  const { mutate: logDose } = useLogDose(currentPatientId);
  const { mutate: deleteDose } = useDeleteDose(currentPatientId);
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

  const handleLogDose = (medicationId: number, status: DoseStatus) => {
    // Find today's scheduled dose for this medication
    const todaysDose = dailySchedule?.find(
      dose => dose.medicationId === medicationId && dose.status === DoseStatus.PENDING
    );

    if (!todaysDose) {
      toast.error('No pending dose found for today');
      return;
    }

    const currentTime = new Date();
    const takenTimeISO = currentTime.toISOString();

    console.log('🕐 Taking dose at:', {
      localTime: currentTime.toString(),
      ISOTime: takenTimeISO,
      medicationId,
      status
    });

    logDose({
      medicationId,
      status,
      scheduledTime: todaysDose.scheduledTime, // Use the actual scheduled time from backend
      takenTime: takenTimeISO,
    }, {
      onSuccess: (data) => {
        console.log('✅ Dose logged successfully:', data);
        toast.success(
          status === DoseStatus.TAKEN ? t('medications.doseTaken') : t('medications.doseSkipped')
        );
      },
      onError: (error) => {
        console.error('❌ Failed to log dose:', error);
        toast.error(t('common.error'));
      }
    });
  };

  const getDoseStatus = (medId: number) => {
    if (!dailySchedule) return null;

    // Check if there's a logged dose for this medication today
    // TEMPORARILY COMMENTED OUT DATE RESTRICTION - Shows Take/Skip for all dates
    // const today = new Date();

    return dailySchedule.find(log => {
      if (log.medicationId !== medId) return false;

      // TEMPORARILY COMMENTED OUT - Allow all dates
      // // Check if this log is for today
      // const logTime = parseISO(log.scheduledTime);
      // const isToday = logTime.getDate() === today.getDate() &&
      //   logTime.getMonth() === today.getMonth() &&
      //   logTime.getFullYear() === today.getFullYear();

      const hasStatus = log.status === DoseStatus.TAKEN || log.status === DoseStatus.SKIPPED;

      // TEMPORARILY COMMENTED OUT DATE CHECK
      // return isToday && hasStatus;
      return hasStatus; // Show status for any date
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
          const doseStatus = getDoseStatus(medication.id);

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
                {/* Medication Image */}
                <div className="h-32 w-full bg-muted/30 relative overflow-hidden">
                  <SecureImage
                    src={medication.medicationImage}
                    alt={medication.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg leading-tight truncate">{medication.name}</h3>
                    <p className="text-xs opacity-90">{medication.dosage}</p>
                  </div>
                </div>

                <CardHeader className="pb-2 pt-3">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Name and dosage moved to image overlay */}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm">
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
                                handleLogDose(medication.id, DoseStatus.TAKEN);
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
                                handleLogDose(medication.id, DoseStatus.SKIPPED);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title={t('medications.undo')}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDose({
                                doseId: doseStatus.id,
                                medicationId: medication.id,
                                scheduledTime: doseStatus.scheduledTime
                              });
                            }}
                          >
                            <Undo className="h-4 w-4" />
                          </Button>
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

                    <div className="space-y-1">
                      {doseStatus && (
                        <div className={cn(
                          "flex items-center font-medium p-2 rounded-md",
                          doseStatus.status === DoseStatus.TAKEN ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        )}>
                          <Check className={cn(
                            "mr-2 h-4 w-4",
                            doseStatus.status === DoseStatus.TAKEN ? "text-green-600" : "text-amber-600"
                          )} />
                          <span className="font-semibold">
                            {doseStatus.status === DoseStatus.TAKEN ? t('medications.taken') : t('medications.skipped')}
                            {' '}({doseStatus.takenTime ? format(parseISO(doseStatus.takenTime), 'h:mm a') : ''})
                          </span>
                        </div>
                      )}

                      <div className={cn(
                        "flex items-center font-medium p-2 rounded-md transition-colors",
                        isHighlighted ? "bg-primary/10 text-primary animate-pulse" : "bg-primary/5 text-primary"
                      )}>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>
                          {t('medications.nextDose')}: {' '}
                          {isHighlighted && nextDoseDate ? (
                            <CountdownTimer targetDate={nextDoseDate} className="font-bold" />
                          ) : (
                            getNextDoseDisplay(medication.id)
                          )}
                        </span>
                      </div>
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
