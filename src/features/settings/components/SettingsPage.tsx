import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
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
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.general')}</CardTitle>
              <CardDescription>
                Manage general account settings
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
                <h3 className="text-lg font-medium">Email Preferences</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Marketing emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new products, features, and more.
                    </p>
                  </div>
                  <Switch id="marketing" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="social">Social emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails for friend requests, follows, and more.
                    </p>
                  </div>
                  <Switch id="social" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security">Security emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity and security.
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
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Push Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-everything">Everything</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive all push notifications.
                    </p>
                  </div>
                  <Switch id="push-everything" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-mentions">Mentions</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications when you're mentioned.
                    </p>
                  </div>
                  <Switch id="push-mentions" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-direct-messages">Direct messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications for direct messages.
                    </p>
                  </div>
                  <Switch id="push-direct-messages" defaultChecked />
                </div>
              </div>
              
              {/* Email Notifications */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-mentions">Mentions</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when you're mentioned.
                    </p>
                  </div>
                  <Switch id="email-mentions" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-reminders">Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminder emails about upcoming events or tasks.
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
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
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
                <h3 className="text-lg font-medium">Font Size</h3>
                <RadioGroup defaultValue="medium">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Small</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Large</Label>
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
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two Factor Authentication */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tfa">Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Switch id="tfa" />
                </div>
              </div>
              
              {/* Sessions */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  You're currently signed in to your account on this device.
                </p>
                <Button variant="outline">Sign out of all devices</Button>
              </div>
              
              {/* Data Privacy */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Data Privacy</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">
                      Allow analytics
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Help us improve by allowing analytics data collection.
                    </p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
              </div>
              
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;