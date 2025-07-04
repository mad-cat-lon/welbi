import { describe, it, expect, vi, afterEach } from 'vitest';
import { execute } from '../../src/graphql/execute';
import type { TypedDocumentString } from '../../src/graphql/graphql';

// Minimal mock for TypedDocumentString
const mockQuery = new String('query { foo }') as TypedDocumentString<{ foo: string }, {}>;

function mockFetch(response: any, ok = true) {
  window.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => response,
  });
}

describe('execute', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on success', async () => {
    const data = { foo: 'bar' };
    mockFetch({ data });
    const result = await execute<typeof data, {}>(mockQuery, {});
    expect(result).toEqual(data);
    expect(window.fetch).toHaveBeenCalled();
  });

  it('throws on network error (non-OK response)', async () => {
    window.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(execute(mockQuery, {})).rejects.toThrow('Network response was not ok');
  });

  it('throws on GraphQL error in response', async () => {
    const errors = [{ message: 'Something went wrong' }];
    mockFetch({ errors });
    await expect(execute(mockQuery, {})).rejects.toThrow('GraphQL Error: Something went wrong');
  });
}); 