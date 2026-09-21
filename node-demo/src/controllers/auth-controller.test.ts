import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { authController } from './auth-controller.js';

interface MockResponse {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
}

function createResponse(): MockResponse {
  const response: MockResponse = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
}

function createRequest(body: unknown): Request {
  return { body } as unknown as Request;
}

describe('authController.register', () => {
  it('returns 400 when email or password is missing', async () => {
    const response = createResponse();

    await authController.register(
      createRequest({ email: 'ada@example.com' }),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'email and password are required' });
  });

  it('registers a new user', async () => {
    const response = createResponse();

    await authController.register(
      createRequest({ email: `new-${crypto.randomUUID()}@example.com`, password: 'password123' }),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: expect.any(String) }),
    );
  });

  it('returns 409 when the email is already registered', async () => {
    const email = `dup-${crypto.randomUUID()}@example.com`;
    await authController.register(
      createRequest({ email, password: 'password123' }),
      createResponse() as unknown as Response,
    );
    const response = createResponse();

    await authController.register(
      createRequest({ email, password: 'password123' }),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({ error: 'email already registered' });
  });
});

describe('authController.login', () => {
  it('returns 400 when email or password is missing', async () => {
    const response = createResponse();

    await authController.login(createRequest({ email: 'ada@example.com' }), response as unknown as Response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'email and password are required' });
  });

  it('returns 401 for an unknown email', async () => {
    const response = createResponse();

    await authController.login(
      createRequest({ email: `missing-${crypto.randomUUID()}@example.com`, password: 'password123' }),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'invalid credentials' });
  });

  it('returns 401 for an incorrect password', async () => {
    const email = `login-${crypto.randomUUID()}@example.com`;
    await authController.register(
      createRequest({ email, password: 'correct-password' }),
      createResponse() as unknown as Response,
    );
    const response = createResponse();

    await authController.login(
      createRequest({ email, password: 'wrong-password' }),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'invalid credentials' });
  });

  it('logs in with correct credentials', async () => {
    const email = `ok-${crypto.randomUUID()}@example.com`;
    await authController.register(
      createRequest({ email, password: 'correct-password' }),
      createResponse() as unknown as Response,
    );
    const response = createResponse();

    await authController.login(
      createRequest({ email, password: 'correct-password' }),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ id: expect.any(String), email });
  });
});
