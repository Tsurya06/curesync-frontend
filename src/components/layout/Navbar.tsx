import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Menu, Settings, User, LogOut, Clock, Users, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useMedications } from '@/features/medications/api';
import { useDoseScheduler } from '@/features/medications/hooks/useDoseScheduler';
import { format, isToday } from 'date-fns';
import { useCaregiver } from '@/features/caregivers/context/CaregiverContext';
import { usePatients } from '@/features/caregivers/api/caregivers';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Caregiver Context
  const { isCaregiver, currentPatientId, switchToPatient, switchToOwnAccount } = useCaregiver();
  const { data: patients } = usePatients();

  // Fetch medications and calculate upcoming doses
  const { data: medications } = useMedications(currentPatientId);
  const { upcomingDoses } = useDoseScheduler(medications || []);

  // Filter for doses due today or overdue (simplified logic for now)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dueDoses = upcomingDoses.filter((dose: any) => isToday(dose.scheduledTime));
  const notificationCount = dueDoses.length;

  const currentPatient = patients?.find(p => p.id === currentPatientId);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">{t('common.openMenu', 'Open menu')}</span>
      </Button>

      {/* Logo */}
      <div className="flex items-center md:hidden">
        <h1 className="text-xl font-bold">App</h1>
      </div>

      {/* Search - could be replaced with a search component */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Patient Switcher */}
        {(patients && patients.length > 0) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                {isCaregiver ? (
                  <>
                    <Users className="h-4 w-4 text-primary" />
                    <span className="max-w-[100px] truncate">{currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : t('analytics.patient', 'Patient')}</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    <span>{t('common.me', 'Me')}</span>
                  </>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('caregivers.switchAccount', 'Switch Account')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchToOwnAccount()}>
                <User className="mr-2 h-4 w-4" />
                <span>{t('common.me', 'My Account')}</span>
                {!isCaregiver && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                {t('caregivers.myPatients', 'My Patients')}
              </DropdownMenuLabel>
              {patients.map((patient) => (
                <DropdownMenuItem
                  key={patient.id}
                  onClick={() => {
                    switchToPatient(patient.id);
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>{patient.firstName} {patient.lastName}</span>
                  {currentPatientId === patient.id && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Notifications - Only show when viewing own account */}
        {!currentPatientId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
                <span className="sr-only">{t('notifications.title', 'Notifications')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t('notifications.title', 'Notifications')}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {t('notifications.subtitle', { count: notificationCount })}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dueDoses.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t('notifications.empty', 'No doses scheduled for today')}
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {dueDoses.slice(0, 5).map((dose: any, index) => (
                    <DropdownMenuItem
                      key={`${dose.medication.id}-${index}`}
                      className="cursor-pointer"
                      onClick={() => navigate(`/medications?highlight=${dose.medication.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{dose.medication.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(dose.scheduledTime, 'h:mm a')} - {dose.medication.dosage}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {dueDoses.length > 5 && (
                    <DropdownMenuItem className="justify-center text-primary font-medium" onClick={() => navigate('/notifications')}>
                      {t('dashboard.viewAll', 'View all')}
                    </DropdownMenuItem>
                  )}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {/* Avatar removed from User type, using initials fallback */}
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>{t('navigation.profile')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('navigation.settings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('navigation.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default Navbar;