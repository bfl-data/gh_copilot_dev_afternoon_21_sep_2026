import bcrypt from 'bcrypt';

const saltRounds = 12;

export const passwordService = {
  /**
   * Hashes a plaintext password for storage.
   *
   * @param password The plaintext password to hash.
   * @returns The generated password hash.
   */
  hash: (password: string): Promise<string> => bcrypt.hash(password, saltRounds),

  /**
   * Verifies a plaintext password against a stored hash.
   *
   * @param password The plaintext password to verify.
   * @param passwordHash The stored password hash.
   * @returns Whether the password matches the hash.
   */
  verify: (password: string, passwordHash: string): Promise<boolean> =>
    bcrypt.compare(password, passwordHash),
};