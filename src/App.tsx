import { Provider } from 'react-redux';
import { store } from '@/store';
import AppRouter from '@/routes';
import './App.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

// Initialize i18n
import '@/lib/i18n';

function App() {
  const { theme, currentTheme } = useTheme();

  // Apply theme class to root element and update document title
  useEffect(() => {
    document.title = "React Application";
    
    // Apply theme class to root html element
    const root = window.document.documentElement;
    
    // Disable transitions during theme change for better performance
    const enableTransitions = () => {
      document.body.classList.remove('disable-transitions');
    };
    
    // Add a class to disable transitions during theme change
    document.body.classList.add('disable-transitions');
    
    // Force reflow to ensure the class is applied before changing theme
    document.body.offsetHeight;
    
    // Apply theme changes
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
    root.setAttribute('data-theme', currentTheme);
    
    // Re-enable transitions after a short delay
    const timeoutId = setTimeout(enableTransitions, 0);
    
    return () => clearTimeout(timeoutId);
  }, [currentTheme]);

  return (
    <Provider store={store}>
      <TooltipProvider>
        <div className={`min-h-screen bg-background text-foreground ${theme}`}>
          <AppRouter />
          <Toaster position="top-right" />
        </div>
      </TooltipProvider>
    </Provider>
  );
}

export default App;