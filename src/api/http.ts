import { API_BASE_URL } from '../config/api';

export { API_BASE_URL };

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('Resposta inválida do servidor.', response.status);
  }

  if (!response.ok) {
    const mensagem =
      typeof body === 'object' &&
      body !== null &&
      'mensagem' in body &&
      typeof (body as { mensagem: unknown }).mensagem === 'string'
        ? (body as { mensagem: string }).mensagem
        : `Erro HTTP ${response.status}`;
    throw new ApiError(mensagem, response.status);
  }

  return body as T;
}
