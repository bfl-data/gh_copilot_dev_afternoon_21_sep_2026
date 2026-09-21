import { describe, expect, it } from 'vitest';
import { passwordService } from './password-service.js';

describe('passwordService', () => {
  it('hashes and verifies a password', async () => {
    const passwordHash = await passwordService.hash('correct horse battery staple');

    await expect(
      passwordService.verify('correct horse battery staple', passwordHash),
    ).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const passwordHash = await passwordService.hash('correct horse battery staple');

    await expect(passwordService.verify('wrong password', passwordHash)).resolves.toBe(false);
  });
});