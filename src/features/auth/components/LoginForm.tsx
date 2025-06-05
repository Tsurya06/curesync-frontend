import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { LoginRequest } from '@/common/types/auth.types';

// Schema for form validation
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  rememberMe: yup.boolean().default(false),
}).required();

interface LoginFormProps {
  onSubmit: (data: LoginRequest & { rememberMe: boolean }) => Promise<void>;
  isSubmitting: boolean;
}

const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
  const { t } = useTranslation();
  
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest & { rememberMe: boolean }>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">
              {t('auth.emailRequired')}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {t('auth.passwordRequired')}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" {...register('rememberMe')} />
          <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('auth.rememberMe')}
          </Label>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('common.loading')}
          </>
        ) : (
          t('auth.login')
        )}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('auth.dontHaveAccount')}</span>
        {' '}
        <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          {t('auth.signUp')}
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;