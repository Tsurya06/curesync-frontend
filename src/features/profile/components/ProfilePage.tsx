import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/hooks';
import { useUpdateProfile, useUploadProfilePicture } from '@/features/auth/api/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const uploadProfilePicture = useUploadProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    updateProfile.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: user.email, // Email usually doesn't change here, but required by type? Checking type...
      // Assuming UpdateProfileRequest might need email or it's optional. 
      // Based on previous view of profile.ts, it takes UpdateProfileRequest.
      // Let's assume we just send what changed or all.
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePicture.mutate(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('profile.personalInfo')}
        </h1>
        <p className="text-muted-foreground">
          {t('profile.personalInfoDesc')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* User info card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {user?.profilePicture && <AvatarImage src={user.profilePicture} alt={user?.firstName} />}
              <AvatarFallback className="text-2xl">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h2 className="text-xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
              <p className="text-sm mt-1 capitalize bg-muted inline-block px-2 py-1 rounded">
                {user?.role}
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button
              className="w-full"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadProfilePicture.isPending}
            >
              {uploadProfilePicture.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('profile.changePicture')}
            </Button>
          </CardContent>
        </Card>

        {/* Profile settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.updateProfile')}</CardTitle>
            <CardDescription>
              Update your personal information and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('profile.tabs.personal')}
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t('profile.tabs.security')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('auth.firstName')}</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('auth.lastName')}</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.email')}</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('profile.emailHint')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile.bio')}</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={t('profile.bioPlaceholder')}
                    />
                  </div>

                  <Button onClick={handleSave} disabled={updateProfile.isPending}>
                    {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('common.save')}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile.currentPassword')}</label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile.newPassword')}</label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile.confirmNewPassword')}</label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button>{t('profile.changePassword')}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;