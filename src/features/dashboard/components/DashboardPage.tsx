import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Activity, List, Calendar } from 'lucide-react';
import { useMedications } from '@/features/medications/api';
import { useDoseHistory } from '@/features/medications/api/doses';
import { calculateAdherenceStats } from '@/features/analytics/utils/adherence-util';
import { AdherenceChart } from '@/features/analytics/components/AdherenceChart';
import { AdherenceScoreWidget, MissedDosesWidget, StreakWidget } from './DashboardWidgets';
import { useMemo } from 'react';

import { useCaregiver } from '@/features/caregivers/context/CaregiverContext';
import { usePatients } from '@/features/caregivers/api/caregivers';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentPatientId } = useCaregiver();
  const { data: patients } = usePatients();

  const { data: medications } = useMedications(currentPatientId);
  const { data: doseHistory } = useDoseHistory(undefined, currentPatientId);

  const stats = useMemo(() => {
    if (!medications || !doseHistory) return null;
    return calculateAdherenceStats(doseHistory);
  }, [medications, doseHistory]);

  // Calculate missed doses for today (simplified)
  // In a real app, this would check against the schedule for today up to current time
  const missedDosesCount = 0; // Placeholder for now until we have robust "missed" logic

  // Get current patient data
  const currentPatient = patients?.find(p => p.id === currentPatientId);

  return (
    <div className="p-6 space-y-6">
      {/* Caregiver Banner */}
      {currentPatientId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">{t('analytics.viewingPatient')}</p>
              <p className="text-xs text-blue-600">{t('analytics.viewingPatientDesc')}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {currentPatientId
            ? t('dashboard.welcome', { name: currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : t('analytics.patient', 'Patient') })
            : t('dashboard.welcome', { name: user?.firstName || '' })
          }
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.summary')}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            {t('dashboard.overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('dashboard.analytics', 'Analytics')}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {t('dashboard.tasks', 'Tasks')}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('dashboard.calendar', 'Calendar')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Analytics Widgets */}
            <div className="col-span-1">
              <AdherenceScoreWidget score={stats?.weeklyTrend[stats.weeklyTrend.length - 1]?.score || 0} />
            </div>
            <div className="col-span-1">
              <StreakWidget streak={stats?.currentStreak || 0} bestStreak={stats?.bestStreak || 0} />
            </div>
            <div className="col-span-1">
              <MissedDosesWidget count={missedDosesCount} />
            </div>

            {/* Placeholder for future widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('analytics.totalDoses', 'Total Doses')}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalDosesLogged || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.lifetimeDoses', 'Lifetime doses logged')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Adherence Chart */}
            <div className="col-span-4">
              {stats && <AdherenceChart data={stats.weeklyTrend} />}
            </div>

            {/* Recent Activity / Tasks (Placeholder for now) */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t('analytics.upcomingDoses', 'Upcoming Doses')}</CardTitle>
                <CardDescription>
                  {t('analytics.upcomingDosesDesc', 'You have upcoming doses for today.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <p>{t('analytics.upcomingDosesEmpty', 'Upcoming doses list coming soon...')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.detailedAnalytics', 'Detailed Analytics')}</CardTitle>
              <CardDescription>
                {t('analytics.detailedAnalyticsDesc', 'View detailed adherence trends and reports.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {stats && <AdherenceChart data={stats.weeklyTrend} title={t('analytics.monthlyTrend', 'Monthly Adherence Trend')} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.tasks', 'Tasks')}</CardTitle>
              <CardDescription>
                {t('dashboard.tasksDesc', 'Manage your tasks and to-dos.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              {t('dashboard.tasksEmpty', 'Tasks content coming soon...')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.calendar', 'Calendar')}</CardTitle>
              <CardDescription>
                {t('dashboard.calendarDesc', 'View and manage your schedule.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              {t('dashboard.calendarEmpty', 'Calendar content coming soon...')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;