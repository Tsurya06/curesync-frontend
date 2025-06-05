import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UserPlus className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          {t('auth.register')}
        </CardTitle>
        <CardDescription className="text-center">
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
};

export default RegisterPage;