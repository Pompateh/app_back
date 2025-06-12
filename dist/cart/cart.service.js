"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let CartService = class CartService {
    prisma = new client_1.PrismaClient();
    async addItem(userId, productId, quantity = 1) {
        const existing = await this.prisma.cartItem.findFirst({
            where: { userId, productId },
        });
        if (existing) {
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity },
            });
        }
        else {
            return this.prisma.cartItem.create({
                data: { userId, productId, quantity },
            });
        }
    }
    async updateItem(itemId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(itemId);
        }
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    }
    async removeItem(itemId) {
        const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }
    async getCart(userId) {
        return this.prisma.cartItem.findMany({ where: { userId } });
    }
    async clearCart(userId) {
        return this.prisma.cartItem.deleteMany({ where: { userId } });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);
//# sourceMappingURL=cart.service.js.map