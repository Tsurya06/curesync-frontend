import { useTranslation } from 'react-i18next';
import { useRegister } from '@/features/auth/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { mutate: register, isPending } = useRegister();

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
          {t('auth.createAccountDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm onSubmit={register} isSubmitting={isPending} />
      </CardContent>
    </Card>
  );
};

export default RegisterPage;