import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    private prisma;
    constructor(jwtService: JwtService);
    register({ email, password, role }: {
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
    validateUser(email: string, password: string): Promise<string | null>;
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
}
