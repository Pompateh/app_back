import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const cookieExtractor = (req: any): string | null => {
  console.log('Extracting token from cookies:', req?.cookies);
  if (req && req.cookies) {
    const token = req.cookies['token'];
    if (!token) {
      console.log('No token found in cookies');
      return null;
    }
    console.log('Token found in cookies');
    return token;
  }
  console.log('No cookies found in request');
  return null;
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
    console.log('Validating JWT payload:', payload);
    if (!payload.sub || !payload.email || !payload.role) {
      console.error('Invalid token payload:', payload);
      throw new UnauthorizedException('Invalid token payload');
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
