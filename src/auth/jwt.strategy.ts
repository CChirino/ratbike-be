import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { SessionsService } from 'src/sessions/sessions.service';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly sessionsService: SessionsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (await this.sessionsService.isTokenInvalidated(payload.jti)) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    return {
      userId: payload.userId,
      name: payload.name,
      lastname: payload.lastname,
      role: payload.role,
      email: payload.email,
      country: payload.country,
    };
  }
}
