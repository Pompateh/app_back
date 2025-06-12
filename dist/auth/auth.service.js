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
    async register({ username, email, password, role }) {
        try {
            if (!password) {
                throw new Error('Password is required');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: {
                    username,
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
    async validateUser(username, password) {
        console.log('Validating user:', { username, password });
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            console.error('User not found for username:', username);
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Password mismatch for username:', username);
            return null;
        }
        const payload = { sub: user.id, username: user.username, role: user.role };
        return this.jwtService.sign(payload);
    }
    async login(loginDto) {
        try {
            console.log('Login attempt for:', loginDto.username);
            const user = await this.prisma.user.findUnique({
                where: { username: loginDto.username },
            });
            if (!user) {
                console.error('User not found for username:', loginDto.username);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            console.log('User found:', user);
            const isMatch = await bcrypt.compare(loginDto.password, user.password);
            if (!isMatch) {
                console.error('Password mismatch for username:', loginDto.username);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { sub: user.id, username: user.username, role: user.role };
            const token = this.jwtService.sign(payload);
            console.log('JWT issued for user:', user.id);
            const response = { token, user: { id: user.id, username: user.username, role: user.role } };
            console.log('Login service returning:', response);
            return response;
        }
        catch (error) {
            console.error('AuthService login error:', error.message, error.stack);
            throw new common_1.InternalServerErrorException('Failed to log in');
        }
    }
    async validateToken(token) {
        try {
            const decoded = this.jwtService.verify(token);
            return { valid: true, user: decoded };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map