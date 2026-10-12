import { MongoClient } from 'mongodb';
import { verifyToken } from '@clerk/backend';
import { parsePreferences } from '../src/utils/preferences.js';

let clientPromise: Promise<MongoClient> | null = null;

async function getCollection() {
  if (!process.env.MONGODB_URI) throw new Error('Database is not configured');
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 }).connect().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }
  return (await clientPromise).db('nutritionmaxx').collection('user_preferences');
}

async function handle(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (!['GET', 'PUT'].includes(req.method)) return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET, PUT, OPTIONS' } });
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!process.env.CLERK_SECRET_KEY) return Response.json({ error: 'Sign-in service is not configured' }, { status: 503 });
  let userId: string;
  try {
    const payload = await verifyToken(auth.slice(7), {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: ['https://nutritionmaxx.com', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    });
    userId = payload.sub;
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let preferences;
  if (req.method === 'PUT') {
    if (!req.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Use JSON' }, { status: 415 });
    const body = await req.text();
    if (new TextEncoder().encode(body).length > 131072) return Response.json({ error: 'Saved data is too large' }, { status: 413 });
    try {
      const json = JSON.parse(body);
      preferences = parsePreferences(json?.preferences);
    } catch {
      return Response.json({ error: 'Invalid saved data' }, { status: 400 });
    }
  }
  try {
    const collection = await getCollection();
    if (req.method === 'GET') {
      const doc = await collection.findOne({ clerkUserId: userId });
      return Response.json({ preferences: doc ? parsePreferences(doc.preferences) : null });
    }
    await collection.updateOne({ clerkUserId: userId }, {
      $set: { preferences, updatedAt: new Date() }, $setOnInsert: { clerkUserId: userId },
    }, { upsert: true });
    return Response.json({ ok: true });
  } catch {
    console.error('Account storage request failed');
    return Response.json({ error: 'Account storage is unavailable' }, { status: 503 });
  }
}

export async function GET(req: Request) { return handle(req); }
export async function PUT(req: Request) { return handle(req); }
export async function OPTIONS(req: Request) { return handle(req); }
