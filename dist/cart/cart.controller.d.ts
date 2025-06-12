import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addItem(body: {
        userId: string;
        productId: string;
        quantity?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }>;
    getCart(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }[]>;
    updateItem(itemId: string, body: {
        quantity: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }>;
    removeItem(itemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }>;
    clearCart(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
