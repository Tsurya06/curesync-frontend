import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  // Optional header props
  pageTitle?: string;
  pageSubtitle?: string;
  showHeader?: boolean;
}

export function ErrorState({
  title = 'Failed to Load',
  message = 'Something went wrong. Please try again.',
  onRetry,
  showRetry = true,
  pageTitle,
  pageSubtitle,
  showHeader = false,
}: ErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Optional Header */}
      {showHeader && (pageTitle || pageSubtitle) && (
        <div className="flex justify-between items-center">
          <div>
            {pageTitle && (
              <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
            )}
            {pageSubtitle && (
              <p className="text-muted-foreground">{pageSubtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Error Card */}
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <X className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            {message}
          </p>
          {showRetry && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
