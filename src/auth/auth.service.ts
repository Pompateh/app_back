import { Injectable, UnauthorizedException , InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(private readonly jwtService: JwtService) {}
  async register({ username, email, password, role }: { username: string; email: string; password: string; role: string }) {
    try {
      if (!password) {
        throw new Error('Password is required');
      }
  
      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save the user to the database
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
        },
      });
  
      return { user };
    } catch (error) {
      console.error('Error in register:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async validateUser(username: string, password: string): Promise<string | null> {
    console.log('Validating user:', { username, password }); // Log input
  
    // Find user by username
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
  
    if (!user) {
      console.error('User not found for username:', username);
      return null;
    }
  
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password mismatch for username:', username);
      return null;
    }
  
    // Generate JWT
    const payload = { sub: user.id, username: user.username, role: user.role };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: { username: string; password: string }) {
    try {
      console.log('Login attempt for:', loginDto.username);
  
      // Find user by username
      const user = await this.prisma.user.findUnique({
        where: { username: loginDto.username },
      });
  
      if (!user) {
        console.error('User not found for username:', loginDto.username);
        throw new UnauthorizedException('Invalid credentials');
      }
  
      console.log('User found:', user);
  
      // Compare passwords
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        console.error('Password mismatch for username:', loginDto.username);
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Generate JWT
      const payload = { sub: user.id, username: user.username, role: user.role };
      const token = this.jwtService.sign(payload);
  
      console.log('JWT issued for user:', user.id);
      const response = { token, user: { id: user.id, username: user.username, role: user.role } };
      console.log('Login service returning:', response);
  
      return response;
    } catch (error) {
      console.error('AuthService login error:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to log in');
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, user: decoded };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}