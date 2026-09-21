import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { userController } from './user-controller.js';

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

function createRequest(body: unknown, id: string = crypto.randomUUID()): Request {
  return { body, params: { id } } as unknown as Request;
}

describe('userController.update', () => {
  it('updates an existing user profile', async () => {
    const createResponseMock = createResponse();
    await userController.create(
      createRequest({ email: 'ada@example.com', displayName: 'Ada' }),
      createResponseMock as unknown as Response,
    );
    const createdProfile = createResponseMock.json.mock.calls[0]?.[0] as {
      id: string;
      createdAt: string;
    };
    const response = createResponse();

    await userController.update(
      createRequest(
        { email: 'ada.lovelace@example.com', displayName: 'Ada Lovelace' },
        createdProfile.id,
      ),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      id: createdProfile.id,
      email: 'ada.lovelace@example.com',
      displayName: 'Ada Lovelace',
      createdAt: createdProfile.createdAt,
    });
  });

  it('returns 404 when the user profile does not exist', async () => {
    const response = createResponse();

    await userController.update(
      createRequest({ email: 'ada@example.com', displayName: 'Ada' }),
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
    });
  });

  it('rejects an invalid update body', async () => {
    const response = createResponse();

    await expect(
      userController.update(
        createRequest({ email: 'not-an-email', displayName: '' }),
        response as unknown as Response,
      ),
    ).rejects.toThrow();
  });
});