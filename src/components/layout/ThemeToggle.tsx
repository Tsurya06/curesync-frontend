import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Theme = 'light' | 'dark' | 'system';

const themes = [
  { id: 'light' as const, icon: Sun, label: 'Light' },
  { id: 'dark' as const, icon: Moon, label: 'Dark' },
  { id: 'system' as const, icon: Monitor, label: 'System' },
];

export function ThemeToggle() {
  const { theme, setTheme, currentTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Calculate next theme without using useMemo
  const getNextTheme = React.useCallback((currentTheme: Theme): Theme => {
    const currentIndex = themes.findIndex(t => t.id === currentTheme);
    return themes[(currentIndex + 1) % themes.length].id;
  }, []);

  // Set up next theme
  const nextTheme = React.useMemo(
    () => getNextTheme(theme as Theme),
    [theme, getNextTheme]
  );

  // Get current theme data
  const currentThemeData = React.useMemo(
    () => themes.find(t => t.id === theme) || themes[0],
    [theme]
  );

  // Set mounted state after initial render
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(nextTheme)}
          className={cn(
            'relative h-9 w-9',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'transition-colors duration-200',
          )}
          aria-label={`Toggle theme (current: ${currentThemeData.label}${theme === 'system' ? `, ${currentTheme}` : ''})`}
        >
          <div className="relative h-4 w-4">
            {themes.map(({ id, icon: ThemeIcon }) => (
              <div
                key={id}
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all duration-300',
                  theme === id ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                )}
              >
                <ThemeIcon className="h-4 w-4" />
              </div>
            ))}
          </div>
          <span className="sr-only">
            Toggle theme (current: {currentThemeData.label})
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        sideOffset={8}
        className="!duration-0 !transition-none"
        style={{ animationDuration: '0s !important', transitionDuration: '0s !important' }}
      >
        <p>
          Switch to {themes.find(t => t.id === nextTheme)?.label} mode
          {theme === 'system' && ` (${currentTheme})`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}