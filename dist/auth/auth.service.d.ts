import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    private prisma;
    constructor(jwtService: JwtService);
    register({ username, email, password, role }: {
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
    validateUser(username: string, password: string): Promise<string | null>;
    login(loginDto: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            role: string;
        };
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
        user: any;
    }>;
}
