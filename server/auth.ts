import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { User, UserRole } from '../src/types';

// Simple signed token simulation for sandboxed environment: "token_{userId}_{role}_{hash}"
export function generateToken(user: User): string {
  const payload = Buffer.from(JSON.stringify({ id: user.id, role: user.role, time: Date.now() })).toString('base64');
  return `tc_${payload}`;
}

export function parseToken(token: string): { id: string; role: UserRole } | null {
  try {
    if (!token.startsWith('tc_')) return null;
    const raw = Buffer.from(token.replace('tc_', ''), 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Also check query param or header for demo flexibility
    const customHeader = req.headers['x-auth-token'] as string;
    if (customHeader) {
      const data = parseToken(customHeader);
      if (data) {
        const found = db.users.find((u) => u.id === data.id);
        if (found) {
          req.user = found;
          return next();
        }
      }
    }
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const data = parseToken(token);
  if (!data) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }

  const foundUser = db.users.find((u) => u.id === data.id);
  if (!foundUser) {
    return res.status(403).json({ error: 'User associated with token no longer exists.' });
  }

  req.user = foundUser;
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role '${req.user.role}' is not authorized to access this resource. Requires one of: [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
}

// Ensure admin only accesses / modifies temple they are authorized to manage
export function requireTempleOwnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required.' });
  }

  const requestedTempleId = req.params.templeId || req.body.templeId || req.query.templeId;
  if (!requestedTempleId) {
    return res.status(400).json({ error: 'Temple ID required.' });
  }

  const temple = db.temples.find((t) => t.id === requestedTempleId);
  if (!temple) {
    return res.status(404).json({ error: 'Temple not found.' });
  }

  if (temple.adminId !== req.user.id && req.user.templeId !== temple.id) {
    return res.status(403).json({
      error: `Access Denied: You are not authorized to administer temple '${temple.name}'.`,
    });
  }

  next();
}

// Ensure contributor is explicitly authorized for this specific temple
export function requireContributorAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'priest') {
    return res.status(403).json({ error: 'Priest role required for contributor proposals.' });
  }

  const requestedTempleId = req.params.templeId || req.body.templeId;
  const temple = db.temples.find((t) => t.id === requestedTempleId);

  if (!temple) {
    return res.status(404).json({ error: 'Temple not found.' });
  }

  const isContributor = temple.contributors && temple.contributors.includes(req.user.id);
  if (!isContributor) {
    return res.status(403).json({
      error: `Forbidden: Contributor access is not automatic. The administrator of '${temple.name}' must explicitly grant you contributor permission.`,
    });
  }

  next();
}
