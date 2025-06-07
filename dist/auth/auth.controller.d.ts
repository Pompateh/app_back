import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    register(body: {
        email: string;
        password: string;
        role: string;
    }): Promise<{
        user: {
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    validateToken(req: Request): Promise<{
        valid: boolean;
        user: any;
    }>;
}
