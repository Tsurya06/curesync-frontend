import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCaregivers, useInvites, useRemoveCaregiver } from '@/features/caregivers/api/caregivers';
import { format } from 'date-fns';
import { CaregiverPermission } from '@/common/types/caregiver.types';
import { useState } from 'react';

export default function CaregiversPage() {
  const { t } = useTranslation();
  const { data: caregivers, isLoading: loadingCaregivers } = useCaregivers();
  const { data: invites, isLoading: loadingInvites } = useInvites();
  const { mutate: removeCaregiver } = useRemoveCaregiver();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleRemove = (caregiverId: number) => {
    if (confirm(t('caregivers.confirmRemove', 'Are you sure you want to remove this caregiver?'))) {
      removeCaregiver(caregiverId);
    }
  };

  const getPermissionLabel = (permission: CaregiverPermission) => {
    return t(`caregivers.permissions.${permission.toLowerCase().replace('_', '')}`);
  };

  const activeCaregivers = caregivers || [];
  const sentInvites = invites || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('caregivers.myCaregivers', 'My Caregivers')}</h2>
          <p className="text-muted-foreground">
            {t('caregivers.caregiversSubtitle', 'Manage who can help with your medications')}
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('caregivers.inviteCaregiver', 'Invite Caregiver')}
        </Button>
      </div>

      {/* Active Caregivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('caregivers.activeCaregivers', 'Active Caregivers')} ({activeCaregivers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCaregivers ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeCaregivers.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {t('caregivers.noCaregivers', 'No caregivers yet')}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t('caregivers.noCaregiversDesc', 'Invite someone to help manage your medications')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeCaregivers.map((caregiver) => (
                <Card key={caregiver.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {caregiver.firstName} {caregiver.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">{caregiver.email}</p>

                          {/* Permissions */}
                          {caregiver.permissions && caregiver.permissions.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {t('caregivers.permissions.title', 'Permissions')}:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {caregiver.permissions.map((permission) => (
                                  <Badge key={permission} variant="secondary" className="text-xs">
                                    {getPermissionLabel(permission)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {caregiver.createdAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {t('caregivers.caringFor', 'Caring for you since')} {format(new Date(caregiver.createdAt), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemove(caregiver.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invites */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('caregivers.pendingInvites', 'Pending Invitations')} ({sentInvites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingInvites ? (
            <Skeleton className="h-20" />
          ) : sentInvites.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              {t('caregivers.noSentInvites', 'No pending invitations')}
            </p>
          ) : (
            <div className="space-y-3">
              {sentInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {invite.caregiver.firstName} {invite.caregiver.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{invite.caregiver.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('caregivers.sentOn', 'Sent')} {format(new Date(invite.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline">{t('caregivers.pending', 'Pending')}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: Add invite modal when needed */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle>{t('caregivers.inviteCaregiver', 'Invite Caregiver')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('caregivers.inviteFeatureComingSoon', 'This feature is coming soon')}
              </p>
              <Button onClick={() => setShowInviteModal(false)} className="w-full">
                {t('common.close', 'Close')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
