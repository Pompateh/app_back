"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let OrderService = class OrderService {
    prisma = new client_1.PrismaClient();
    async findAll() {
        return this.prisma.order.findMany();
    }
    async findOne(id) {
        return this.prisma.order.findUnique({ where: { id } });
    }
    async create(createDto) {
        return this.prisma.order.create({
            data: {
                orderRef: createDto.orderRef,
                userId: createDto.userId,
                customer: createDto.userId,
                total: createDto.total,
                status: createDto.status,
            },
        });
    }
    async remove(id) {
        return this.prisma.order.delete({ where: { id } });
    }
    async checkout(userId) {
        const cartItems = await this.prisma.cartItem.findMany({ where: { userId } });
        if (cartItems.length === 0) {
            throw new common_1.NotFoundException('Cart is empty');
        }
        let total = 0;
        for (const item of cartItems) {
            const product = await this.prisma.shopProduct.findUnique({ where: { id: item.productId } });
            if (product) {
                total += product.price * item.quantity;
            }
        }
        const orderRef = 'ORD-' + Date.now();
        const order = await this.prisma.order.create({
            data: {
                orderRef,
                userId,
                customer: userId,
                total,
                status: 'pending',
            },
        });
        await this.prisma.cartItem.deleteMany({ where: { userId } });
        return order;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)()
], OrderService);
//# sourceMappingURL=order.service.js.map