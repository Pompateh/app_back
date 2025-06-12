import type { Response } from 'express';
import { AuthService } from './auth.service';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
