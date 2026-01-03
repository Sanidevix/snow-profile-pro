import { useState, useEffect, useCallback } from 'react';

export function useCurrentTime(frozen: boolean = false) {
  const [time, setTime] = useState<Date>(new Date());
  const [frozenTime, setFrozenTime] = useState<Date | null>(null);

  useEffect(() => {
    if (frozen) return;

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [frozen]);

  const freezeTime = useCallback(() => {
    setFrozenTime(new Date());
  }, []);

  const unfreezeTime = useCallback(() => {
    setFrozenTime(null);
  }, []);

  const currentTime = frozenTime ?? time;

  return {
    currentTime,
    frozenTime,
    isFrozen: frozenTime !== null,
    freezeTime,
    unfreezeTime,
  };
}

// Format time in UTC (standard for nivological observations)
export function formatTimeUTC(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

// Format time for display (HH:MM:SS UTC)
export function formatTimeShortUTC(date: Date): string {
  return date.toISOString().substring(11, 19) + ' UTC';
}

// Format date for display
export function formatDateUTC(date: Date): string {
  return date.toISOString().substring(0, 10);
}

// Get ISO timestamp
export function getISOTimestamp(date: Date): string {
  return date.toISOString();
}
