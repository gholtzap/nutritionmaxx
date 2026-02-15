interface WindowState {
  currentCount: number;
  previousCount: number;
  windowStart: number;
}

interface AttemptResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export class SlidingWindowRateLimiter {
  private windows = new Map<string, WindowState>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  attempt(key: string): AttemptResult {
    const now = Date.now();
    let state = this.windows.get(key);

    if (!state) {
      state = { currentCount: 0, previousCount: 0, windowStart: now };
      this.windows.set(key, state);
    }

    const elapsed = now - state.windowStart;

    if (elapsed >= this.windowMs * 2) {
      state.previousCount = 0;
      state.currentCount = 0;
      state.windowStart = now;
    } else if (elapsed >= this.windowMs) {
      state.previousCount = state.currentCount;
      state.currentCount = 0;
      state.windowStart = state.windowStart + this.windowMs;
    }

    const elapsedInWindow = now - state.windowStart;
    const elapsedFraction = elapsedInWindow / this.windowMs;
    const estimatedCount =
      state.previousCount * (1 - elapsedFraction) + state.currentCount;

    if (estimatedCount >= this.maxRequests) {
      const retryAfterMs = Math.ceil(
        this.windowMs * (1 - (this.maxRequests - state.currentCount) / Math.max(state.previousCount, 1))
      ) - elapsedInWindow;
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(retryAfterMs, 1000),
      };
    }

    state.currentCount++;
    const newEstimate =
      state.previousCount * (1 - elapsedFraction) + state.currentCount;

    return {
      allowed: true,
      remaining: Math.max(0, Math.floor(this.maxRequests - newEstimate)),
      retryAfterMs: 0,
    };
  }

  reset(key: string): void {
    this.windows.delete(key);
  }
}
