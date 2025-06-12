import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        userId: string | null;
    }[]>;
}
