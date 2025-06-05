import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { RegisterRequest } from '@/common/types/auth.types';
import { Loader2 } from 'lucide-react';

// Schema for form validation
const registerSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required(),
}).required();

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    try {
      setIsSubmitting(true);
      
      const { firstName, lastName, email, password } = data;
      const success = await registerUser({ firstName, lastName, email, password });
      
      if (success) {
        toast({
          title: t('auth.registerSuccess'),
          variant: 'default',
        });
        
        // Navigate to dashboard after successful registration
        navigate('/dashboard');
      } else {
        toast({
          title: t('errors.somethingWentWrong'),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('auth.firstName')}</Label>
            <Input
              id="firstName"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">
                {t('auth.nameRequired')}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('auth.lastName')}</Label>
            <Input
              id="lastName"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {t('auth.nameRequired')}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">
              {t('auth.emailInvalid')}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {t('auth.passwordMinLength')}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {t('auth.passwordMismatch')}
            </p>
          )}
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('common.loading')}
          </>
        ) : (
          t('auth.register')
        )}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('auth.alreadyHaveAccount')}</span>
        {' '}
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          {t('auth.signIn')}
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;