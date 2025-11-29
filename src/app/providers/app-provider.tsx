import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

interface AppProviderProps {
  children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
        </div>

        {import.meta.env.DEV && (
          <pre className="rounded bg-muted p-3 text-xs overflow-auto">
            {error.message}
          </pre>
        )}

        <div className="flex gap-2">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Combines all app-level providers
 * Order matters: QueryProvider > AuthProvider > ThemeProvider
 * Note: CaregiverProvider is added in MainLayout since it needs Router context
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
