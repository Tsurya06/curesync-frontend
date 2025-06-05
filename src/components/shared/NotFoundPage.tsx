import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">{t('errors.pageNotFound')}</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('errors.somethingWentWrong')}
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate(-1)} variant="outline" className="mr-2">
            {t('common.back')}
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            {t('navigation.dashboard')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;