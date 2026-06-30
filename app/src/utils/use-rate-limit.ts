import { useState, useRef, useCallback, useEffect } from 'react';

interface UseRateLimitOptions {
  action: string;
  windowMs: number;
  maxRequests: number;
}

interface UseRateLimitReturn {
  checkLimit: () => boolean;
  isLimited: boolean;
  retryAfterMs: number;
}

const attempts = new Map<string, number[]>();

function attempt(key: string, windowMs: number, maxRequests: number) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= maxRequests) {
    const retryAfterMs = windowMs - (now - recent[0]);
    attempts.set(key, recent);
    return { allowed: false, retryAfterMs };
  }

  recent.push(now);
  attempts.set(key, recent);
  return { allowed: true, retryAfterMs: 0 };
}

export function useRateLimit({
  action,
  windowMs,
  maxRequests,
}: UseRateLimitOptions): UseRateLimitReturn {
  const [isLimited, setIsLimited] = useState(false);
  const [retryAfterMs, setRetryAfterMs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const checkLimit = useCallback((): boolean => {
    const result = attempt(`${action}:${windowMs}:${maxRequests}`, windowMs, maxRequests);

    if (!result.allowed) {
      setIsLimited(true);
      setRetryAfterMs(result.retryAfterMs);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsLimited(false);
        setRetryAfterMs(0);
      }, result.retryAfterMs);
      return false;
    }

    setIsLimited(false);
    setRetryAfterMs(0);
    return true;
  }, [action, windowMs, maxRequests]);

  return { checkLimit, isLimited, retryAfterMs };
}
