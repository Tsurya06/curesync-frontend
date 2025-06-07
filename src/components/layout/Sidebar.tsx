import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart, Settings, User, Users, X } from 'lucide-react';
import { UserRole } from '@/common/types/auth.types';
import { useGetUserProfileQuery } from '@/features/auth/api/authApi';
import '@/lib/i18n';
interface SidebarProps {
  className?: string;
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ className, mobile = false, onClose }: SidebarProps) => {
  const { t } = useTranslation(['navigation']);
  const { data: user } = useGetUserProfileQuery();
  const location = useLocation();

  const isAdmin = user?.role === UserRole.ROLE_ADMIN;

  const navigation = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
    },
    {
      name: t('profile'),
      href: '/profile',
      icon: User,
      current: location.pathname === '/profile',
    },
    {
      name: t('settings'),
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings',
    },
    // Admin only routes
    ...(isAdmin
      ? [
          {
            name: 'Admin',
            href: '/admin',
            icon: Users,
            current: location.pathname === '/admin',
          },
          {
            name: 'Analytics',
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
      <div className="flex h-16 items-center border-b px-6">
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
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
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
      </ScrollArea>

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