import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginRequest } from '@/common/types/auth.types';
import LoginForm from './LoginForm';
import { Key } from 'lucide-react';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (data: LoginRequest & { rememberMe: boolean }) => {
    console.log(from)
    try {
      setIsSubmitting(true);
      
      const { email, password } = data;
      const success = await loginUser({ email, password });
      
      if (success) {
        toast({
          title: t('auth.loginSuccess'),
          variant: 'default',
        });
        
        // Navigate to the redirect path
        navigate(from, { replace: true });
      } else {
        toast({
          title: t('auth.invalidCredentials'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('errors.somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Key className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          {t('auth.login')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth.loginToYourAccount')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm 
          onSubmit={handleLogin} 
          isSubmitting={isSubmitting} 
        />
      </CardContent>
    </Card>
  );
};

export default LoginPage;