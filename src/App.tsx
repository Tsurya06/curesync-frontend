import AppRouter from '@/app/router/app-router';
import { AppProvider } from '@/app/providers/app-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import './App.css';

// Initialize i18n
import '@/lib/i18n';

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <AppRouter />
          <Toaster position="top-center" closeButton gap={24} />
          <PWAInstallPrompt />
        </div>
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;