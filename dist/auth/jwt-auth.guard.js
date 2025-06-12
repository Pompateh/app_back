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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const public_decorator_1 = require("./public.decorator");
let JwtAuthGuard = class JwtAuthGuard {
    reflector;
    jwtService;
    constructor(reflector, jwtService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    async canActivate(ctx) {
        const request = ctx.switchToHttp().getRequest();
        const path = request.url;
        console.log(`[JwtAuthGuard Debug] Request path: ${path}`);
        if (path === '/api/health') {
            console.log(`[JwtAuthGuard Debug] Skipping auth for health check path: ${path}`);
            return true;
        }
        const isPublic = this.reflector.get(public_decorator_1.IS_PUBLIC_KEY, ctx.getHandler());
        console.log(`[JwtAuthGuard Debug] Request to ${ctx.getHandler().name} isPublic: ${isPublic}`);
        if (isPublic) {
            console.log(`[JwtAuthGuard Debug] Skipping auth for public route (decorator): ${ctx.getHandler().name}`);
            return true;
        }
        const req = ctx.switchToHttp().getRequest();
        const cookies = req.cookies || {};
        const authHeader = req.headers.authorization;
        let token;
        if (cookies.token) {
            token = cookies.token;
        }
        else if (authHeader) {
            const [scheme, hdrToken] = authHeader.split(' ');
            if (scheme === 'Bearer' && hdrToken) {
                token = hdrToken;
            }
        }
        if (!token) {
            console.log(`[JwtAuthGuard Debug] No token found for non-public route: ${ctx.getHandler().name}`);
            throw new common_1.UnauthorizedException('No authentication token');
        }
        try {
            const payload = this.jwtService.verify(token);
            req.user = payload;
            console.log(`[JwtAuthGuard Debug] Token verified for ${ctx.getHandler().name}`);
            return true;
        }
        catch (err) {
            console.error(`[JwtAuthGuard Debug] Token verification failed for ${ctx.getHandler().name}: ${err.message}`);
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map