// Shared test utilities and mocks

export function mockUser(overrides = {}) {
  return {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function mockRole(overrides = {}) {
  return {
    id: 'role-1',
    name: 'admin',
    permissions: [],
    ...overrides,
  };
} 