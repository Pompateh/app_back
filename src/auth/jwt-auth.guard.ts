// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator'; // Import the key

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 1) allow @Public() routes
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY, // Use the imported key
      ctx.getHandler(),
    );
    console.log(`[JwtAuthGuard Debug] Request to ${ctx.getHandler().name} isPublic: ${isPublic}`); // Added log

    if (isPublic) {
      console.log(`[JwtAuthGuard Debug] Skipping auth for public route: ${ctx.getHandler().name}`); // Added log
      return true;
    }

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
      console.log(`[JwtAuthGuard Debug] No token found for non-public route: ${ctx.getHandler().name}`); // Added log
      throw new UnauthorizedException('No authentication token');
    }

    // 3) verify and attach payload
    try {
      const payload = this.jwtService.verify(token);
      req.user = payload;
      console.log(`[JwtAuthGuard Debug] Token verified for ${ctx.getHandler().name}`); // Added log
      return true;
    } catch (err) {
      console.error(`[JwtAuthGuard Debug] Token verification failed for ${ctx.getHandler().name}: ${err.message}`); // Added log
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
