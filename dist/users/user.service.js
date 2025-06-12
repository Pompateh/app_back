"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    prisma = new client_1.PrismaClient();
    saltRounds = 10;
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
        const user = await this.prisma.user.create({
            data: {
                username: 'default_username',
                email: createUserDto.email,
                password: hashedPassword,
                role: createUserDto.role || 'user',
            },
        });
        return { id: user.id, email: user.email, role: user.role };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, role: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async update(id, updateUserDto) {
        const data = { ...updateUserDto };
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
        }
        const user = await this.prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, role: true },
        });
        return user;
    }
    async remove(id) {
        const user = await this.prisma.user.delete({
            where: { id },
            select: { id: true, email: true, role: true },
        });
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map