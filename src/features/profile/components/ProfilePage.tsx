import { useState, FormEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Loader2 } from 'lucide-react';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  bio?: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FormErrors = {
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
  };
  password?: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || ''
  });
  
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    profile: {},
    password: {}
  });
  
  const validateProfileForm = (): boolean => {
    const newErrors: FormErrors['profile'] = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = t('profile.firstNameRequired');
    }
    
    if (!profileData.lastName.trim()) {
      newErrors.lastName = t('profile.lastNameRequired');
    }
    
    setErrors(prev => ({
      ...prev,
      profile: newErrors
    }));
    
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = (): boolean => {
    const newErrors: FormErrors['password'] = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = t('profile.currentPasswordRequired');
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = t('profile.newPasswordRequired');
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = t('auth.passwordMinLength');
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMismatch');
    }
    
    setErrors(prev => ({
      ...prev,
      password: newErrors
    }));
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors.profile?.[name as keyof ProfileFormData]) {
      setErrors(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: undefined
        }
      }));
    }
  };
  
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors.password?.[name as keyof PasswordFormData]) {
      setErrors(prev => ({
        ...prev,
        password: {
          ...prev.password,
          [name]: undefined
        }
      }));
    }
  };
  
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;
    
    try {
      setIsProfileSubmitting(true);
      await updateProfile(profileData);
      
      toast({
        title: t('profile.updateSuccess'),
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: t('errors.somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsProfileSubmitting(false);
    }
  };
  
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    
    try {
      setIsPasswordSubmitting(true);
      const { currentPassword, newPassword } = passwordData;
      await updatePassword(currentPassword, newPassword);
      
      // Reset form on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast({
        title: t('profile.passwordUpdateSuccess'),
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: t('errors.somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('profile.personalInfo')}
        </h1>
        <p className="text-muted-foreground">
          Manage your profile information and settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* User info card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} alt={user?.firstName} />
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

            <Button className="w-full">Change Profile Picture</Button>
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
            <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('profile.personalInfo')}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t('profile.security')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className={errors.profile?.firstName ? 'border-destructive' : ''}
                      />
                      {errors.profile?.firstName && (
                        <p className="text-sm text-destructive">
                          {errors.profile.firstName}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className={errors.profile?.lastName ? 'border-destructive' : ''}
                      />
                      {errors.profile?.lastName && (
                        <p className="text-sm text-destructive">
                          {errors.profile.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('profile.contactSupportEmail')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('profile.bio')}</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profileData.bio || ''}
                      onChange={handleProfileChange}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                      placeholder={t('profile.bioPlaceholder')}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isProfileSubmitting}>
                    {isProfileSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.saving')}
                      </>
                    ) : (
                      t('common.save')
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="security">
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={errors.password?.currentPassword ? 'border-destructive' : ''}
                    />
                    {errors.password?.currentPassword && (
                      <p className="text-sm text-destructive">
                        {errors.password.currentPassword}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={errors.password?.newPassword ? 'border-destructive' : ''}
                    />
                    {errors.password?.newPassword && (
                      <p className="text-sm text-destructive">
                        {errors.password.newPassword}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={errors.password?.confirmPassword ? 'border-destructive' : ''}
                    />
                    {errors.password?.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.password.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" disabled={isPasswordSubmitting}>
                    {isPasswordSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.updating')}
                      </>
                    ) : (
                      t('profile.changePassword')
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;