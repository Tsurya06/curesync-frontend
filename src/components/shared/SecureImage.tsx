import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: React.ReactNode;
}

export function SecureImage({ src, alt, className, fallback, ...props }: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(null);
      return;
    }

    // If it's a public URL or data URL, just use it directly
    if (src.startsWith('data:') || src.startsWith('blob:') || src.includes('/public/')) {
      setImageSrc(src);
      return;
    }

    let isMounted = true;
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const response = await api.get(src, { responseType: 'blob' });
        const url = URL.createObjectURL(response);

        if (isMounted) {
          setImageSrc(url);
        } else {
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          console.error('Failed to load secure image:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (error || !src) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/30 text-muted-foreground/20", className)}>
        {fallback || <ImageIcon className="h-12 w-12" />}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/30", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <img
      src={imageSrc || ''}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
