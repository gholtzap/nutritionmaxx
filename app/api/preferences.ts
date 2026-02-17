import { MongoClient } from 'mongodb';
import { verifyToken } from '@clerk/backend';

export const config = { runtime: 'nodejs' };

let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI!);
    await cachedClient.connect();
  }
  return cachedClient.db('nutritionmaxx');
}

async function authenticate(req: Request): Promise<string | null> {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const token = auth.slice(7);
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    return payload.sub;
  } catch {
    return null;
  }
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  const userId = await authenticate(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = await getDb();
  const collection = db.collection('user_preferences');

  if (req.method === 'GET') {
    const doc = await collection.findOne({ clerkUserId: userId });
    if (!doc) {
      return new Response(JSON.stringify({ preferences: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ preferences: doc.preferences }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'PUT') {
    let body: { preferences: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!body.preferences || typeof body.preferences !== 'object') {
      return new Response(JSON.stringify({ error: 'Missing preferences' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await collection.updateOne(
      { clerkUserId: userId },
      {
        $set: {
          preferences: body.preferences,
          updatedAt: new Date(),
        },
        $setOnInsert: { clerkUserId: userId },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
