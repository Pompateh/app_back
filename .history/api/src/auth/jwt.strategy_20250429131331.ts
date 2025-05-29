import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const cookieExtractor = (req: any): string | null => {
    if (req && req.cookies) {
      return req.cookies['token'] || null;
    }
    return null;
  };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract token from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Do not ignore token expiration
      ignoreExpiration: false,
      // Use a secret key from your environment variables (or a default value)
      secretOrKey: process.env.JWT_SECRET || 'taodep123',
    });
  }

  async validate(payload: any) {
    // The validate method is called after a token is verified.
    // You can add additional validation logic here if needed.
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
