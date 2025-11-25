import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { useDoseHistory } from '@/features/medications/api/doses';
import { DoseStatus } from '@/common/types/dose.types';
import { format, parseISO } from 'date-fns';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DoseHistoryModalProps {
  medicationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DoseHistoryModal({ medicationId: _medicationId, open, onOpenChange }: DoseHistoryModalProps) {
  const { t } = useTranslation();
  const { data: history, isLoading } = useDoseHistory();

  const getStatusIcon = (status: DoseStatus) => {
    switch (status) {
      case DoseStatus.TAKEN:
        return <Check className="h-4 w-4 text-green-600" />;
      case DoseStatus.SKIPPED:
        return <X className="h-4 w-4 text-amber-600" />;
      case DoseStatus.MISSED:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: DoseStatus) => {
    switch (status) {
      case DoseStatus.TAKEN:
        return t('medications.taken');
      case DoseStatus.SKIPPED:
        return t('medications.skipped');
      case DoseStatus.MISSED:
        return t('medications.missed');
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('medications.historyTitle', 'Dose History')}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : !history?.length ? (
            <div className="text-center py-10 text-muted-foreground">
              {t('medications.noHistory', 'No dose history available')}
            </div>
          ) : (
            <div className="space-y-4">
              {history.slice().reverse().map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className={`mt-1 p-1.5 rounded-full ${log.status === DoseStatus.TAKEN ? 'bg-green-100' :
                    log.status === DoseStatus.SKIPPED ? 'bg-amber-100' :
                      'bg-destructive/10'
                    }`}>
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {getStatusText(log.status)}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {log.takenTime ? format(parseISO(log.takenTime), 'MMM d, h:mm a') : '-'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('medications.scheduledFor')}: {log.scheduledTime ? format(parseISO(log.scheduledTime), 'h:mm a') : '-'}
                    </p>
                    {log.notes && (
                      <p className="text-xs italic text-muted-foreground mt-1">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
