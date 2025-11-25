import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart, Settings, User, Users, X, Pill } from 'lucide-react';
import { UserRole } from '@/common/types/auth.types';

interface SidebarProps {
  className?: string;
  mobile?: boolean;
  onClose?: () => void;
}

import { useCaregiver } from '@/features/caregivers/context/CaregiverContext';

const Sidebar = ({ className, mobile = false, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const { currentPatientId } = useCaregiver();

  const isAdmin = user?.role === UserRole.ADMIN;

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
    },
    {
      name: t('medications.title', 'Medications'),
      href: '/medications',
      icon: Pill,
      current: location.pathname.startsWith('/medications'),
    },
    // Only show "Caregivers" (manage my caregivers) if I am viewing my own account
    ...(!currentPatientId ? [{
      name: t('caregivers.title', 'Caregivers'),
      href: '/caregivers',
      icon: Users,
      current: location.pathname === '/caregivers',
    }] : []),
    {
      name: t('caregivers.myPatients', 'My Patients'),
      href: '/patients',
      icon: Users,
      current: location.pathname === '/patients',
    },
    {
      name: t('navigation.profile'),
      href: '/profile',
      icon: User,
      current: location.pathname === '/profile',
    },
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings',
    },
    // Admin only routes
    ...(isAdmin
      ? [
        {
          name: t('navigation.admin', 'Admin'),
          href: '/admin',
          icon: Users,
          current: location.pathname === '/admin',
        },
        {
          name: t('navigation.analytics', 'Analytics'),
          href: '/analytics',
          icon: BarChart,
          current: location.pathname === '/analytics',
        },
      ]
      : []),
  ];

  return (
    <div className={cn('flex h-full w-60 flex-col border-r bg-card', className)}>
      {/* Header with logo and close button (mobile only) */}
      <div className="flex h-16 items-center border-b px-6 shrink-0">
        <h1 className="text-xl font-bold">App</h1>

        {mobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        <nav className="flex flex-col space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={`${item.href}${location.search}`}
              onClick={mobile && onClose ? onClose : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer with version info */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;