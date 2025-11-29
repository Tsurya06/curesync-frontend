import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, Palette } from 'lucide-react';
import { useTheme } from '@/lib/hooks';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


const SettingsPage = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('settings.general')}
        </h1>
        <p className="text-muted-foreground">
          {t('settings.generalDesc')}
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t('settings.tabs.general')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('settings.tabs.notifications')}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {t('settings.tabs.appearance')}
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('settings.tabs.privacy')}
          </TabsTrigger>

        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.generalSection.title')}</CardTitle>
              <CardDescription>
                {t('settings.generalSection.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.language')}</h3>
                <RadioGroup
                  defaultValue={i18n.language}
                  onValueChange={(value) => i18n.changeLanguage(value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="en" />
                    <Label htmlFor="en">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="es" id="es" />
                    <Label htmlFor="es">Español</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hin" id="hin" />
                    <Label htmlFor="es">Hindi</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notificationsSection.title')}</CardTitle>
              <CardDescription>
                {t('settings.notificationsSection.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Push Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.notificationsSection.pushTitle')}</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-everything">{t('settings.notificationsSection.pushEverything')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notificationsSection.pushEverythingDesc')}
                    </p>
                  </div>
                  <Switch id="push-everything" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearanceSection.title')}</CardTitle>
              <CardDescription>
                {t('settings.appearanceSection.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.theme')}</h3>
                <RadioGroup
                  defaultValue={theme}
                  onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">{t('settings.lightMode')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">{t('settings.darkMode')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">{t('settings.systemDefault')}</Label>
                  </div>
                </RadioGroup>
              </div>


            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.privacySection.title')}</CardTitle>
              <CardDescription>
                {t('settings.privacySection.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sessions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.privacySection.sessionsTitle')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('settings.privacySection.sessionsDesc')}
                </p>
                <Button variant="outline">{t('settings.privacySection.signOutAll')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;