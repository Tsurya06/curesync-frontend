import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Flame, Trophy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AdherenceScoreWidgetProps {
	score: number;
}

export function AdherenceScoreWidget({ score }: AdherenceScoreWidgetProps) {
	const { t } = useTranslation();

	// Color based on score
	const colorClass = score >= 80 ? 'text-primary' : score >= 50 ? 'text-amber-500' : 'text-destructive';


	// SVG Circle calculation
	const radius = 35;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (score / 100) * circumference;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					{t('analytics.dailyScore', 'Daily Score')}
				</CardTitle>
				<Trophy className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4">
					<div className="relative h-20 w-20 flex items-center justify-center">
						{/* Background Circle */}
						<svg className="h-full w-full -rotate-90 transform" viewBox="0 0 80 80">
							<circle
								className="text-muted/20"
								strokeWidth="8"
								stroke="currentColor"
								fill="transparent"
								r={radius}
								cx="40"
								cy="40"
							/>
							{/* Progress Circle */}
							<circle
								className={cn("transition-all duration-1000 ease-out", colorClass)}
								strokeWidth="8"
								strokeDasharray={circumference}
								strokeDashoffset={strokeDashoffset}
								strokeLinecap="round"
								stroke="currentColor"
								fill="transparent"
								r={radius}
								cx="40"
								cy="40"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className={cn("text-xl font-bold", colorClass)}>{score}%</span>
						</div>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">
							{score === 100
								? t('analytics.perfectDay', 'Perfect day! Keep it up!')
								: t('analytics.keepGoing', 'Keep going!')}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

interface StreakWidgetProps {
	streak: number;
	bestStreak: number;
}

export function StreakWidget({ streak, bestStreak }: StreakWidgetProps) {
	const { t } = useTranslation();

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					{t('analytics.streak', 'Current Streak')}
				</CardTitle>
				<Flame className={cn("h-4 w-4", streak > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{streak} {t('common.days', 'days')}</div>
				<p className="text-xs text-muted-foreground">
					{t('analytics.bestStreak', 'Best')}: {bestStreak} {t('common.days', 'days')}
				</p>
			</CardContent>
		</Card>
	);
}

interface MissedDosesWidgetProps {
	count: number;
}

export function MissedDosesWidget({ count }: MissedDosesWidgetProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	if (count === 0) {
		return (
			<Card className="bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
						{t('analytics.status', 'Status')}
					</CardTitle>
					<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-700 dark:text-green-400">
						{t('analytics.onTrack', 'On Track')}
					</div>
					<p className="text-xs text-green-600/80 dark:text-green-400/80">
						{t('analytics.noMissed', 'No missed doses')}
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-destructive/10 border-destructive/20">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-destructive">
					{t('analytics.attention', 'Needs Attention')}
				</CardTitle>
				<AlertCircle className="h-4 w-4 text-destructive" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-destructive">
					{count} {t('analytics.missed', 'Missed')}
				</div>
				<Button
					variant="link"
					className="px-0 h-auto text-xs text-destructive underline"
					onClick={() => navigate('/medications')}
				>
					{t('analytics.viewMissed', 'View missed doses')}
				</Button>
			</CardContent>
		</Card>
	);
}
