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
    const request = ctx.switchToHttp().getRequest();
    const path = request.url; // Get the request path

    // Debugging log for the path
    console.log(`[JwtAuthGuard Debug] Request path: ${path}`);

    // 1) Explicitly allow /api/health for health checks
    if (path === '/api/health') {
      console.log(`[JwtAuthGuard Debug] Skipping auth for health check path: ${path}`);
      return true;
    }

    // 2) Allow @Public() routes (fallback check)
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY, // Use the imported key
      ctx.getHandler(),
    );
    console.log(`[JwtAuthGuard Debug] Request to ${ctx.getHandler().name} isPublic: ${isPublic}`); // Added log

    if (isPublic) {
      console.log(`[JwtAuthGuard Debug] Skipping auth for public route (decorator): ${ctx.getHandler().name}`); // Modified log
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const cookies = req.cookies || {};
    const authHeader = req.headers.authorization as string;

    // 3) extract token from cookie OR header
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

    // 4) verify and attach payload
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
