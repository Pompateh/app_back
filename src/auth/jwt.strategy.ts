import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const cookieExtractor = (req: any): string | null => {
  if (req && req.cookies) {
    const token = req.cookies['token'];
    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }
    return token;
  }
  throw new UnauthorizedException('No cookies found in request');
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || (() => {
        console.error('JWT_SECRET environment variable is not set!');
        throw new Error('JWT_SECRET environment variable is not set');
      })(),
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
