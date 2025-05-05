export declare class SettingService {
    private prisma;
    getAll(): Promise<{
        id: string;
        key: string;
        value: string;
    }[]>;
    getSetting(key: string): Promise<{
        id: string;
        key: string;
        value: string;
    } | null>;
    updateSetting(key: string, value: string): Promise<{
        id: string;
        key: string;
        value: string;
    }>;
}
