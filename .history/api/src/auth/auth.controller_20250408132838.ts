import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
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
  async login(@Body() loginDto: LoginDto) {
    console.log('Login request received:', loginDto); // Debug log
    const token = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!token) {
      console.error('Invalid credentials'); // Debug log
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('Login successful, token generated'); // Debug log
    return { accessToken: token };
  }
}