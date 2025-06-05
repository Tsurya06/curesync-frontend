import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="!duration-0 !transition-none"
        style={{ animationDuration: '0s !important', transitionDuration: '0s !important' }}
      >
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className="focus:bg-accent focus:text-accent-foreground"
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('es')}
          className="focus:bg-accent focus:text-accent-foreground"
        >
          Español
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('hin')}
          className="focus:bg-accent focus:text-accent-foreground"
        >
          Hindi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;