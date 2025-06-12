import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    register(body: {
        username: string;
        email: string;
        password: string;
        role: string;
    }): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            role: string;
        };
    }>;
    validateToken(req: Request): Promise<{
        valid: boolean;
        message: string;
        user?: undefined;
    } | {
        valid: boolean;
        user: any;
        message?: undefined;
    }>;
}
