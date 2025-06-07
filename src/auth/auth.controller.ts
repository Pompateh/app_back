import { Controller, Post, Body, UnauthorizedException, Res, Get, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { IsString, IsNotEmpty } from 'class-validator';

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
  constructor(private readonly authService: AuthService) {}

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
    
    // Set the cookie
    res.cookie('token', result.token, {
      httpOnly: false, // Allow JavaScript access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
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
    console.log('Cookies:', req.cookies);
    
    const token = req.cookies.token;
    if (!token) {
      console.log('No token found in cookies');
      return { valid: false, message: 'No token provided' };
    }
    
    console.log('Token found, validating...');
    try {
      const result = await this.authService.validateToken(token);
      console.log('Token validation result:', result);
      return { valid: true, user: result };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, message: 'Invalid token' };
    }
  }

}
