import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';
import { passwordService } from '../services/password-service.js';

// In-memory user store for the demo. Keyed by email.
const users = new Map<string, { id: string; email: string; passwordHash: string }>();

interface Credentials {
  email: string;
  password: string;
}

// Returns undefined when either field is missing so callers can return a uniform 400.
function parseCredentials(req: Request): Credentials | undefined {
  const { email, password } = req.body as { email?: string; password?: string };
  return email && password ? { email, password } : undefined;
}

export const authController = {
  register: async (req: Request, res: Response) => {
    const credentials = parseCredentials(req);
    if (!credentials) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const { email, password } = credentials;

    if (users.has(email)) {
      return res.status(409).json({ error: 'email already registered' });
    }

    const passwordHash = await passwordService.hash(password);

    const id = crypto.randomUUID();
    users.set(email, { id, email, passwordHash });

    logger.info({ email }, 'User registered');
    return res.status(201).json({ id, email });
  },

  login: async (req: Request, res: Response) => {
    const credentials = parseCredentials(req);
    if (!credentials) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const { email, password } = credentials;

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const valid = await passwordService.verify(password, user.passwordHash);
    if (!valid) {
      logger.warn({ email }, 'Login failed: bad password');
      return res.status(401).json({ error: 'invalid credentials' });
    }

    logger.info({ email }, 'User logged in');
    return res.status(200).json({ id: user.id, email: user.email });
  },
};
