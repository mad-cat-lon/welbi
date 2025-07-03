import { describe, it, expect } from 'vitest';
import { createContext } from './context';

describe('createContext', () => {
  it('returns default context for anonymous user', async () => {
    const ctx = await createContext({ req: {}, res: {} } as any);
    expect(ctx.user).toBeUndefined();
    expect(ctx.ability).toBeDefined();
  });
}); 