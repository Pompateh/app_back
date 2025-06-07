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
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

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
    const token = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!token) {
      console.error('Invalid credentials'); // Debug log
      throw new UnauthorizedException('Invalid credentials');
    }
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    
    console.log('Login successful, token generated'); // Debug log
    return { accessToken: token };
  }
  @Public()
  @Get('validate')
  async validateToken(@Req() req: Request) {
    const cookies = req.cookies || {};
    const token = cookies.token;
