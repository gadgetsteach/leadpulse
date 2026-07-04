import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  businessId?: string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fintel_super_secret_jwt_key_2026_purple_m3';

    jwt.verify(token, secret, (err, decoded: any) => {
      if (err) {
        res.status(403).json({ error: 'Forbidden: Invalid token' });
        return;
      }
      req.businessId = decoded.businessId;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
};
