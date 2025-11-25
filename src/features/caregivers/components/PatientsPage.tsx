import { useTranslation } from 'react-i18next';
import { Users, Check, X, Clock, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatients, useReceivedInvites, useAcceptInvite, useRejectInvite } from '@/features/caregivers/api/caregivers';
import { useCaregiver } from '@/features/caregivers/context/CaregiverContext';
import { format } from 'date-fns';

export default function PatientsPage() {
	const { t } = useTranslation();
	const { switchToPatient } = useCaregiver();
	const { data: patients, isLoading: loadingPatients } = usePatients();
	const { data: invites, isLoading: loadingInvites } = useReceivedInvites();
	const { mutate: acceptInvite, isPending: accepting } = useAcceptInvite();
	const { mutate: declineInvite, isPending: declining } = useRejectInvite();

	const handleAccept = (inviteId: number) => {
		acceptInvite({ inviteId });
	};

	const handleDecline = (inviteId: number) => {
		declineInvite({ inviteId });
	};

	const handleViewPatient = (patientId: number) => {
		switchToPatient(patientId);
		// Navigate to medications page with patient context
		window.location.href = '/medications';
	};

	const activePatients = patients || [];
	const pendingInvites = invites || [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">{t('caregivers.myPatients')}</h2>
				<p className="text-muted-foreground">
					{t('caregivers.patientsSubtitle', 'Manage medications for your patients')}
				</p>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="patients" className="space-y-4">
				<TabsList>
					<TabsTrigger value="patients">
						{t('caregivers.myPatients')} ({activePatients.length})
					</TabsTrigger>
					<TabsTrigger value="invitations">
						{t('caregivers.invitations')} ({pendingInvites.length})
					</TabsTrigger>
				</TabsList>

				{/* My Patients Tab */}
				<TabsContent value="patients" className="space-y-4">
					{loadingPatients ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((i) => (
								<Card key={i}>
									<CardHeader>
										<Skeleton className="h-6 w-3/4" />
									</CardHeader>
									<CardContent>
										<Skeleton className="h-20 w-full" />
									</CardContent>
								</Card>
							))}
						</div>
					) : activePatients.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center">
								<div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
									<Users className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t('caregivers.noPatients')}
								</h3>
								<p className="text-muted-foreground">
									{t('caregivers.noPatientsDesc', 'You will see patients here after accepting their invitations')}
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{activePatients.map((patient) => (
								<Card
									key={patient.id}
									className="group hover:shadow-md transition-all cursor-pointer"
									onClick={() => handleViewPatient(patient.id)}
								>
									<CardHeader className="pb-3">
										<CardTitle className="text-lg flex items-center justify-between">
											<span>{patient.firstName} {patient.lastName}</span>
											<Pill className="h-5 w-5 text-primary" />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{/* Permissions */}
											<div className="space-y-2">
												<p className="text-xs font-medium text-muted-foreground">
													{t('caregivers.yourPermissions', 'Your Permissions')}:
												</p>
												<div className="flex flex-wrap gap-1">
													{patient.permissions?.map((permission) => (
														<Badge key={permission} variant="secondary" className="text-xs">
															{t(`caregivers.permissions.${permission.toLowerCase().replace('_', '')}`)}
														</Badge>
													))}
												</div>
											</div>

											{/* Added Date */}
											{patient.createdAt && (
												<div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
													<Clock className="h-3 w-3" />
													{t('caregivers.caringFor', 'Caring for since')} {format(new Date(patient.createdAt), 'MMM d, yyyy')}
												</div>
											)}

											{/* View Button */}
											<Button
												className="w-full mt-2"
												variant="outline"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													handleViewPatient(patient.id);
												}}
											>
												{t('caregivers.viewMedications', 'View Medications')}
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				{/* Invitations Tab */}
				<TabsContent value="invitations" className="space-y-4">
					{loadingInvites ? (
						<div className="space-y-4">
							{[1, 2].map((i) => (
								<Card key={i}>
									<CardContent className="py-4">
										<Skeleton className="h-20 w-full" />
									</CardContent>
								</Card>
							))}
						</div>
					) : pendingInvites.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center">
								<div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
									<Users className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t('caregivers.noInvitations', 'No pending invitations')}
								</h3>
								<p className="text-muted-foreground">
									{t('caregivers.noInvitationsDesc', 'Invitations from patients will appear here')}
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{pendingInvites.map((invite) => (
								<Card key={invite.id}>
									<CardContent className="py-4">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1 space-y-2">
												<div>
													<p className="font-semibold text-lg">{invite.patient.firstName} {invite.patient.lastName}</p>
													<p className="text-sm text-muted-foreground">{invite.patient.email}</p>
												</div>

												<div className="space-y-1">
													<p className="text-xs font-medium text-muted-foreground">
														{t('caregivers.offeredPermissions', 'Offered Permissions')}:
													</p>
													<div className="flex flex-wrap gap-1">
														{invite.permissions?.map((permission) => (
															<Badge key={permission} variant="secondary" className="text-xs">
																{t(`caregivers.permissions.${permission.toLowerCase().replace('_', '')}`)}
															</Badge>
														))}
													</div>
												</div>

												<p className="text-xs text-muted-foreground">
													{t('caregivers.receivedOn', 'Received')} {format(new Date(invite.createdAt), 'MMM d, yyyy')}
												</p>
											</div>

											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleDecline(invite.id)}
													disabled={accepting || declining}
													className="text-destructive hover:text-destructive"
												>
													<X className="h-4 w-4 mr-1" />
													{t('caregivers.decline', 'Decline')}
												</Button>
												<Button
													size="sm"
													onClick={() => handleAccept(invite.id)}
													disabled={accepting || declining}
												>
													<Check className="h-4 w-4 mr-1" />
													{t('caregivers.accept', 'Accept')}
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
