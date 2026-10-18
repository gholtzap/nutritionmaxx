import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultPreferences } from '../preferences';

const mocks = vi.hoisted(() => ({
  verify: vi.fn(), find: vi.fn(), update: vi.fn(), connect: vi.fn(),
}));
vi.mock('@clerk/backend', () => ({ verifyToken: mocks.verify }));
vi.mock('mongodb', () => ({ MongoClient: class {
  connect = mocks.connect;
} }));
import { GET, PUT } from '../../../api/preferences';

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('CLERK_SECRET_KEY', 'test');
  vi.stubEnv('MONGODB_URI', 'test');
  mocks.verify.mockResolvedValue({ sub: 'user-a' });
  mocks.connect.mockResolvedValue({ db: () => ({ collection: () => ({ findOne: mocks.find, updateOne: mocks.update }) }) });
});

function request(method: string, value?: unknown) {
  return new Request('https://nutritionmaxx.com/api/preferences', {
    method, headers: { Authorization: 'Bearer test', 'Content-Type': 'application/json' },
    ...(value === undefined ? {} : { body: JSON.stringify(value) }),
  });
}

describe('preferences API', () => {
  it('rejects requests without a token before database access', async () => {
    expect((await GET(new Request('https://nutritionmaxx.com/api/preferences'))).status).toBe(401);
    expect(mocks.connect).not.toHaveBeenCalled();
  });
  it('rejects invalid tokens', async () => {
    mocks.verify.mockRejectedValue(new Error('invalid'));
    expect((await GET(request('GET'))).status).toBe(401);
    expect(mocks.find).not.toHaveBeenCalled();
  });
  it('rejects invalid data without writing it', async () => {
    expect((await PUT(request('PUT', { preferences: { planEntries: [{ name: 'Rice', servingsPerWeek: -1 }] } }))).status).toBe(400);
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it('uses the token owner for writes and reads', async () => {
    const prefs = defaultPreferences();
    expect((await PUT(request('PUT', { preferences: prefs, clerkUserId: 'user-b' }))).status).toBe(200);
    expect(mocks.update.mock.calls[0][0]).toEqual({ clerkUserId: 'user-a' });
    mocks.find.mockResolvedValue({ preferences: prefs });
    expect(await (await GET(request('GET'))).json()).toEqual({ preferences: prefs });
    expect(mocks.find).toHaveBeenCalledWith({ clerkUserId: 'user-a' });
  });
  it('fails safely when stored data is invalid', async () => {
    mocks.find.mockResolvedValue({ preferences: { budgetTolerance: -1 } });
    expect((await GET(request('GET'))).status).toBe(503);
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
