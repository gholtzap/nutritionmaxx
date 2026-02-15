import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

const redis = Redis.fromEnv();

const limiters: Record<string, Ratelimit> = {
  autofill: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'rl:autofill',
  }),
  share: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '60 s'),
    prefix: 'rl:share',
  }),
  default: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    prefix: 'rl:default',
  }),
};

function getClientIdentifier(req: Request): string {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const cookies = req.headers.get('cookie') || '';
  const cidMatch = cookies.match(/rl_cid=([a-f0-9]+)/);
  const clientId = cidMatch ? cidMatch[1] : 'none';
  return `${ip}:${clientId}`;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'default';
  const limiter = limiters[action] || limiters.default;
  const identifier = getClientIdentifier(req);

  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  const resetSeconds = Math.ceil((reset - Date.now()) / 1000);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(reset),
    'Cache-Control': 'no-store',
  };

  if (!success) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        ...headers,
        'Retry-After': String(Math.max(resetSeconds, 1)),
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}
