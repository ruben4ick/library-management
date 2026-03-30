import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from '../types';
import CONFIG from '../config';

export interface RequestWithUser<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery extends Record<string, any> = Record<string, any>,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: JwtPayload;
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    return res.status(401).json({ message: 'Please provide authorization token' });
  }

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please provide correct authorization token' });
  }

  const accessToken = authorization.slice(7);

  jwt.verify(accessToken, CONFIG.jwtSecret, (err, decoded) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Access token is not valid' });
      }

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Access token is expired' });
      }

      return next(err);
    }

    (req as RequestWithUser).user = {
      userId: (decoded as JwtPayload).userId,
      email: (decoded as JwtPayload).email,
      role: (decoded as JwtPayload).role,
    };

    next();
  });
}
