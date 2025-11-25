import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        // Don't show again in this session
        sessionStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Check if already dismissed in this session
    useEffect(() => {
        if (sessionStorage.getItem('pwa-install-dismissed')) {
            setShowInstallPrompt(false);
        }
    }, []);

    if (!showInstallPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5">
            <Card className="p-4 shadow-lg border-2 border-primary/20 relative">
                {/* Close button in top-right */}
                <Button
                    onClick={handleDismiss}
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-6 w-6"
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="flex items-start gap-3 pr-6">
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg">
                        <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">Install CureSync App</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                            Install our app for a better experience with offline access and push notifications!
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleInstallClick}
                                size="sm"
                                className="flex-1"
                            >
                                Install
                            </Button>
                            <Button
                                onClick={handleDismiss}
                                size="sm"
                                variant="outline"
                            >
                                Not Now
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
