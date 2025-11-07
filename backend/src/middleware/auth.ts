import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role?: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No autorizado, token faltante' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as any;
    req.user = { id: decoded.userId ?? decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// Alias con el nombre que algunos ficheros esperan
export const authenticate = protect;

// authorize ahora acepta authorize('a','b') o authorize(['a','b'])
export const authorize = (...allowedRolesArgs: any[]) => {
  // Normalizar a array de strings
  const allowedRoles: string[] =
    allowedRolesArgs.length === 1 && Array.isArray(allowedRolesArgs[0])
      ? (allowedRolesArgs[0] as string[])
      : (allowedRolesArgs as string[]);

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Si protect ya corrió, usamos req.user.role
      if (req.user && req.user.role) {
        if (allowedRoles.includes(req.user.role)) return next();
        return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
      }

      // Si protect no corrió, intentar leer token y comprobar role
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No autorizado, token faltante' });
      }
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'secret';
      const decoded = jwt.verify(token, secret) as any;
      const role = decoded.role;
      if (role && allowedRoles.includes(role)) return next();
      return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
  };
};

export default protect;