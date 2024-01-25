import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.body.refreshToken;

    const isExpired = this.authService.isRefreshTokenExpired(refreshToken);

    if (isExpired) {
      const newAccessToken = this.authService.refreshToken(refreshToken);
      res.locals.newAccessToken = newAccessToken;
    }

    next();
  }
}
