// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 1) allow @Public() routes
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      ctx.getHandler(),
    );
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const cookies = req.cookies || {};
    const authHeader = req.headers.authorization as string;

    // 2) extract token from cookie OR header
    let token: string | undefined;
    if (cookies.token) {
      token = cookies.token;
    } else if (authHeader) {
      const [scheme, hdrToken] = authHeader.split(' ');
      if (scheme === 'Bearer' && hdrToken) {
        token = hdrToken;
      }
    }

    if (!token) {
      throw new UnauthorizedException('No authentication token');
    }

    // 3) verify and attach payload
    try {
      const payload = this.jwtService.verify(token);
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
