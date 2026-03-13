import { useState, useRef, useCallback, useEffect } from 'react';
import { SlidingWindowRateLimiter } from './rate-limit.ts';

interface UseRateLimitOptions {
  action: string;
  windowMs: number;
  maxRequests: number;
}

interface UseRateLimitReturn {
  checkLimit: () => boolean;
  isLimited: boolean;
  remaining: number;
  retryAfterMs: number;
}

const limiters = new Map<string, SlidingWindowRateLimiter>();

function getLimiter(action: string, windowMs: number, maxRequests: number): SlidingWindowRateLimiter {
  const key = `${action}:${windowMs}:${maxRequests}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new SlidingWindowRateLimiter(windowMs, maxRequests);
    limiters.set(key, limiter);
  }
  return limiter;
}

export function useRateLimit({
  action,
  windowMs,
  maxRequests,
}: UseRateLimitOptions): UseRateLimitReturn {
  const [isLimited, setIsLimited] = useState(false);
  const [remaining, setRemaining] = useState(maxRequests);
  const [retryAfterMs, setRetryAfterMs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const checkLimit = useCallback((): boolean => {
    const limiter = getLimiter(action, windowMs, maxRequests);
    const result = limiter.attempt(action);

    if (!result.allowed) {
      setIsLimited(true);
      setRemaining(0);
      setRetryAfterMs(result.retryAfterMs);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsLimited(false);
        setRemaining(maxRequests);
        setRetryAfterMs(0);
      }, result.retryAfterMs);
      return false;
    }

    setRemaining(result.remaining);
    setIsLimited(false);
    setRetryAfterMs(0);
    return true;
  }, [action, windowMs, maxRequests]);

  return { checkLimit, isLimited, remaining, retryAfterMs };
}
