"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    jwtService;
    prisma = new client_1.PrismaClient();
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async register({ email, password, role }) {
        try {
            if (!password) {
                throw new Error('Password is required');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                },
            });
            return { user };
        }
        catch (error) {
            console.error('Error in register:', error.message, error.stack);
            throw new common_1.InternalServerErrorException('Failed to register user');
        }
    }
    async validateUser(email, password) {
        console.log('Validating user:', { email, password });
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            console.error('User not found for email:', email);
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Password mismatch for email:', email);
            return null;
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
    async login(loginDto) {
        try {
            console.log('Login attempt for:', loginDto.email);
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
            });
            if (!user) {
                console.error('User not found for email:', loginDto.email);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            console.log('User found:', user);
            console.log('Plain text password:', loginDto.password);
            console.log('Hashed password from database:', user.password);
            const isMatch = await bcrypt.compare(loginDto.password, user.password);
            if (!isMatch) {
                console.error('Password mismatch for email:', loginDto.email);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { sub: user.id, email: user.email, role: user.role };
            const token = this.jwtService.sign(payload);
            console.log('JWT issued for user:', user.id);
            return { token, user: { id: user.id, email: user.email, role: user.role } };
        }
        catch (error) {
            console.error('AuthService login error:', error.message, error.stack);
            throw new common_1.InternalServerErrorException('Failed to log in');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map