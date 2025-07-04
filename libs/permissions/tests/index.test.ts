import { describe, it, expect } from 'vitest';
import {
  createAbilityForUser,
  canUserPerform,
  cannotUserPerform,
  getUserPermissions,
  hasRole,
  createPermission,
  ROLES,
} from '../src/index';

describe('Permissions Utilities', () => {
  const user = { id: '1', email: '', name: '', createdAt: new Date(), updatedAt: new Date() };
  const superAdminRole = { id: 'r1', name: ROLES.SUPER_ADMIN, permissions: [createPermission('manage', 'all')] };
  const userRole = { id: 'r2', name: ROLES.USER, permissions: [createPermission('read', 'Post')] };

  it('creates ability for super admin', () => {
    const ability = createAbilityForUser(user, [superAdminRole]);
    expect(canUserPerform(ability, 'manage', 'all')).toBe(true);
  });

  it('creates ability for user', () => {
    const ability = createAbilityForUser(user, [userRole]);
    expect(canUserPerform(ability, 'read', 'Post')).toBe(true);
    expect(cannotUserPerform(ability, 'delete', 'Post')).toBe(true);
  });

  it('gets user permissions', () => {
    const perms = getUserPermissions(user, [userRole]);
    expect(perms.length).toBeGreaterThan(0);
  });

  it('checks for role', () => {
    expect(hasRole([userRole], ROLES.USER)).toBe(true);
    expect(hasRole([userRole], ROLES.ADMIN)).toBe(false);
  });

  it('creates permission object', () => {
    const perm = createPermission('read', 'Post');
    expect(perm.action).toBe('read');
    expect(perm.subject).toBe('Post');
  });
}); 