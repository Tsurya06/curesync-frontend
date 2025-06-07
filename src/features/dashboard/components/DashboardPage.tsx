import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutGrid, Activity, List, Calendar } from 'lucide-react'
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated'
import { lazy, Suspense, useEffect } from 'react'
import LoadingFallback from '@/components/shared/LoadingFallback'

const OverviewPane  = lazy(() => import('./tabs-content/OverviewPane'))
const AnalyticsPane = lazy(() => import('./tabs-content/AnalyticsPane'))
const TasksPane     = lazy(() => import('./tabs-content/TasksPane'))
const CalendarPane  = lazy(() => import('./tabs-content/CalenderPane'))

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const { user } = useIsAuthenticated()
  useEffect(()=>{
    console.log("########",user?.firstName)
  },[user])
  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('welcome', { name: user?.firstName || '' })}
        </h1>
        <p className="text-muted-foreground">{t('summary')}</p>
      </div>

      {/* tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview"  className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />  {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />    {t('analytics')}
          </TabsTrigger>
          <TabsTrigger value="tasks"     className="flex items-center gap-2">
            <List className="h-4 w-4" />        {t('tasks')}
          </TabsTrigger>
          <TabsTrigger value="calendar"  className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />    {t('calendar')}
          </TabsTrigger>
        </TabsList>

        <Suspense fallback={<LoadingFallback />}>
          <TabsContent value="overview"  className="space-y-4"><OverviewPane /></TabsContent>
          <TabsContent value="analytics" className="space-y-4"><AnalyticsPane/></TabsContent>
          <TabsContent value="tasks"     className="space-y-4"><TasksPane    /></TabsContent>
          <TabsContent value="calendar"  className="space-y-4"><CalendarPane /></TabsContent>
        </Suspense>
      </Tabs>
    </div>
  )
}