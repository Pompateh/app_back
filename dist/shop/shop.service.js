"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ShopService = class ShopService {
    prisma = new client_1.PrismaClient();
    async findAll() {
        try {
            return await this.prisma.shopProduct.findMany();
        }
        catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    }
    async findOne(id) {
        try {
            const product = await this.prisma.shopProduct.findUnique({ where: { id } });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${id} not found`);
            }
            return product;
        }
        catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
            throw error;
        }
    }
    async create(createDto) {
        try {
            return await this.prisma.shopProduct.create({
                data: {
                    productId: createDto.productId,
                    title: createDto.title,
                    description: createDto.description,
                    price: createDto.price,
                    imageUrl: createDto.image,
                },
            });
        }
        catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Failed to create product');
        }
    }
    async update(id, updateDto) {
        try {
            const product = await this.prisma.shopProduct.findUnique({ where: { id } });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${id} not found`);
            }
            return await this.prisma.shopProduct.update({
                where: { id },
                data: updateDto,
            });
        }
        catch (error) {
            console.error(`Error updating product with ID ${id}:`, error);
            throw new Error('Failed to update product');
        }
    }
    async remove(id) {
        try {
            const product = await this.prisma.shopProduct.findUnique({ where: { id } });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${id} not found`);
            }
            return await this.prisma.shopProduct.delete({ where: { id } });
        }
        catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error);
            throw new Error('Failed to delete product');
        }
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)()
], ShopService);
//# sourceMappingURL=shop.service.js.map