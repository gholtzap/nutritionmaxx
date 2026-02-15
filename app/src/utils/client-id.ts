const STORAGE_KEY = 'rl_client_id';
const COOKIE_NAME = 'rl_cid';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(): string | null {
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  return match ? match.split('=')[1] : null;
}

function setCookie(id: string): void {
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getClientId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCookie(stored);
      return stored;
    }
  } catch {
    // localStorage unavailable
  }

  const fromCookie = getCookie();
  if (fromCookie) {
    try {
      localStorage.setItem(STORAGE_KEY, fromCookie);
    } catch {
      // localStorage unavailable
    }
    return fromCookie;
  }

  const id = generateId();
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // localStorage unavailable
  }
  setCookie(id);
  return id;
}
