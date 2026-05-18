const CLIENT_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
const SERVER_API_BASE = process.env.INTERNAL_API_URL ?? CLIENT_API_BASE;

function getApiBase() {
  return typeof window === 'undefined' ? SERVER_API_BASE : CLIENT_API_BASE;
}

interface FetchOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Unknown error', code: 'UNKNOWN' }));
    throw new ApiError(response.status, body.code, body.error);
  }

  return response.json() as Promise<T>;
}

export function apiServer<T>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, next: { revalidate: 60 } });
}
