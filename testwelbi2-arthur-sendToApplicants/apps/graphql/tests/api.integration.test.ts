import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

async function graphqlRequest(query: string, variables?: Record<string, any>, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

describe('GraphQL API Integration', () => {
  it('should fetch health status', async () => {
    const query = `query Health { health }`;
    const result = await graphqlRequest(query);
    expect(result.data.health).toBeTypeOf('string');
  });

  it('should fetch events', async () => {
    const query = `query Events { events { id title } }`;
    const result = await graphqlRequest(query);
    expect(Array.isArray(result.data.events)).toBe(true);
  });

  it('should return error for invalid query', async () => {
    const query = `query Invalid { notAField }`;
    const result = await graphqlRequest(query);
    expect(result.errors).toBeDefined();
    expect(result.errors[0].message).toMatch(/Cannot query field/);
  });

}); 