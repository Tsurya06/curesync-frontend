import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, Palette, Code } from 'lucide-react';
import { useTheme } from '@/lib/hooks';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApiConfig } from '@/lib/api-config';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();
  const { isMockMode, toggleMockMode } = useApiConfig();

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
          <TabsTrigger value="developer" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Developer
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

              {/* Email Preferences */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">{t('settings.emailPrefs.title')}</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">{t('settings.emailPrefs.marketing')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.emailPrefs.marketingDesc')}
                    </p>
                  </div>
                  <Switch id="marketing" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="social">{t('settings.emailPrefs.social')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.emailPrefs.socialDesc')}
                    </p>
                  </div>
                  <Switch id="social" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security">{t('settings.emailPrefs.security')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.emailPrefs.securityDesc')}
                    </p>
                  </div>
                  <Switch id="security" defaultChecked disabled />
                </div>
              </div>

              <Button>{t('common.save')}</Button>
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-mentions">{t('settings.notificationsSection.pushMentions')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notificationsSection.pushMentionsDesc')}
                    </p>
                  </div>
                  <Switch id="push-mentions" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-direct-messages">{t('settings.notificationsSection.pushDirect')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notificationsSection.pushDirectDesc')}
                    </p>
                  </div>
                  <Switch id="push-direct-messages" defaultChecked />
                </div>
              </div>

              {/* Email Notifications */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">{t('settings.notificationsSection.emailTitle')}</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-mentions">{t('settings.notificationsSection.emailMentions')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notificationsSection.emailMentionsDesc')}
                    </p>
                  </div>
                  <Switch id="email-mentions" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-reminders">{t('settings.notificationsSection.emailReminders')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notificationsSection.emailRemindersDesc')}
                    </p>
                  </div>
                  <Switch id="email-reminders" defaultChecked />
                </div>
              </div>

              <Button>{t('common.save')}</Button>
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

              {/* Font Size */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">{t('settings.appearanceSection.fontSize')}</h3>
                <RadioGroup defaultValue="medium">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">{t('settings.appearanceSection.small')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">{t('settings.appearanceSection.medium')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">{t('settings.appearanceSection.large')}</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button>{t('common.save')}</Button>
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
              {/* Two Factor Authentication */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.privacySection.tfaTitle')}</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tfa">{t('settings.privacySection.enableTfa')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.privacySection.tfaDesc')}
                    </p>
                  </div>
                  <Switch id="tfa" />
                </div>
              </div>

              {/* Sessions */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">{t('settings.privacySection.sessionsTitle')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('settings.privacySection.sessionsDesc')}
                </p>
                <Button variant="outline">{t('settings.privacySection.signOutAll')}</Button>
              </div>

              {/* Data Privacy */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">{t('settings.privacySection.dataPrivacyTitle')}</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">
                      {t('settings.privacySection.allowAnalytics')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.privacySection.allowAnalyticsDesc')}
                    </p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
              </div>

              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="developer">
          <Card>
            <CardHeader>
              <CardTitle>Developer Settings</CardTitle>
              <CardDescription>
                Configure development tools and mock data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mock-mode">Use Mock Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between simulated mock data and real backend API.
                  </p>
                </div>
                <Switch
                  id="mock-mode"
                  checked={isMockMode}
                  onCheckedChange={toggleMockMode}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;