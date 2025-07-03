import type { Request, Response } from 'express';
import { createAbilityForUser, createMongoAbility } from '@testwelbi/permissions';
import { db } from '@testwelbi/drizzle';
import type { Context, User, Role } from './types';

interface AuthenticatedRequest extends Request {
  user?: User;
  roles?: Role[];
}

export async function createContext({ req, res }: { req: AuthenticatedRequest; res: Response }): Promise<Context> {
  // Extract user from JWT token (this would be implemented with actual auth)
  const user = req.user;
  const roles = req.roles || [];

  // Create CASL ability for the user
  let ability;
  if (user) {
    // Convert database user to permissions user format
    const permissionsUser = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt ? new Date(user.createdAt * 1000) : new Date(),
      updatedAt: user.updatedAt ? new Date(user.updatedAt * 1000) : new Date(),
    };
    const permissionsRoles = roles.map(role => ({
      id: role.id.toString(),
      name: role.name,
      permissions: [], // Would be populated from database
    }));
    ability = createAbilityForUser(permissionsUser, permissionsRoles);
  } else {
    // Create minimal ability for anonymous users
    ability = createMongoAbility([]);
  }

  return {
    user,
    roles,
    ability,
    db,
  };
}

// Middleware to extract user from JWT (placeholder implementation)
export function authenticateUser(req: AuthenticatedRequest, res: Response, next: Function) {
  // This would extract and verify JWT token
  // For now, we'll just set a placeholder
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    
    // TODO: Verify JWT token and extract user
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = await getUserById(decoded.userId);
    // req.roles = await getUserRoles(decoded.userId);
  }
  
  next();
} 