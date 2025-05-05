import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        message: string;
    }[]>;
}
