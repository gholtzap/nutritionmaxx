import { useState, useRef, useCallback, useEffect } from 'react';
import { SlidingWindowRateLimiter } from './rate-limit.ts';
import { getClientId } from './client-id.ts';

interface UseRateLimitOptions {
  action: string;
  windowMs: number;
  maxRequests: number;
  checkServer?: boolean;
}

interface UseRateLimitReturn {
  checkLimit: () => Promise<boolean>;
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
  checkServer = false,
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

  const checkLimit = useCallback(async (): Promise<boolean> => {
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

    if (checkServer) {
      try {
        getClientId();
        const res = await fetch(`/api/check-rate?action=${encodeURIComponent(action)}`, {
          credentials: 'same-origin',
        });
        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get('Retry-After') || '10', 10) * 1000;
          setIsLimited(true);
          setRemaining(0);
          setRetryAfterMs(retryAfter);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setIsLimited(false);
            setRemaining(maxRequests);
            setRetryAfterMs(0);
          }, retryAfter);
          return false;
        }
        const serverRemaining = parseInt(res.headers.get('X-RateLimit-Remaining') || String(maxRequests), 10);
        setRemaining(Math.min(result.remaining, serverRemaining));
      } catch {
        // server unreachable -- fall back to client-only
      }
    } else {
      setRemaining(result.remaining);
    }

    setIsLimited(false);
    setRetryAfterMs(0);
    return true;
  }, [action, windowMs, maxRequests, checkServer]);

  return { checkLimit, isLimited, remaining, retryAfterMs };
}
