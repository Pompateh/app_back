export declare class NotificationService {
    private prisma;
    logNotification(message: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        message: string;
    }>;
    getAll(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        message: string;
    }[]>;
}
