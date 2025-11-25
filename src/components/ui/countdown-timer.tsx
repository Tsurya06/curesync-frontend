import { useState, useEffect } from 'react';
import { differenceInSeconds, format } from 'date-fns';

interface CountdownTimerProps {
    targetDate: Date;
    className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const diff = differenceInSeconds(targetDate, now);

            if (diff <= 0) {
                return 'Due now';
            }

            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            if (hours > 24) {
                return format(targetDate, 'MMM d, h:mm a');
            }

            return `${hours}h ${minutes}m ${seconds}s`;
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return <span className={className}>{timeLeft}</span>;
}
