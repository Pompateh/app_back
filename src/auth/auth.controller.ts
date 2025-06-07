import { Controller, Post, Body, UnauthorizedException, Res, Get, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { IsString, IsNotEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';

// Define LoginDto as a standalone class
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // Change from username to email

  @IsString()
  @IsNotEmpty()
  password: string;
}


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; role: string }) {
    return this.authService.register(body);
  }

  @Public() // Mark this route as public
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Login request received:', loginDto); // Debug log
    const result = await this.authService.login(loginDto);
    console.log('Login service result:', result); // Debug log
    
    // Set the cookie with proper cross-domain settings
    res.cookie('token', result.token, {
      httpOnly: false, // Allow JavaScript access
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: '.onrender.com',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    
    console.log('Login successful, token generated and cookie set'); // Debug log
    console.log('Returning response:', result); // Debug log
    return result; // Return the service result directly
  }

  @Public()
  @Get('validate')
  async validateToken(@Req() req: Request) {
    console.log('Validate token request received');
    console.log('Request headers:', req.headers);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Authorization header found');
      return { valid: false, message: 'No token provided' };
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token found in Authorization header, validating...');
    
    try {
      // Use JwtService directly instead of going through the guard
      const decoded = this.jwtService.verify(token);
      console.log('Token validation result:', decoded);
      return { valid: true, user: decoded };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, message: 'Invalid token' };
    }
  }

}
