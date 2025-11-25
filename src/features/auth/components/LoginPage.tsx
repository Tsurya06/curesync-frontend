import { useTranslation } from 'react-i18next';
import { useLogin } from '@/features/auth/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginRequest } from '@/common/types/auth.types';
import LoginForm from './LoginForm';
import { Key } from 'lucide-react';

const LoginPage = () => {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin();

  const handleLogin = async (data: LoginRequest & { rememberMe: boolean }) => {
    const { email, password } = data;
    login({ email, password });
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
          isSubmitting={isPending}
        />
      </CardContent>
    </Card>
  );
};

export default LoginPage;