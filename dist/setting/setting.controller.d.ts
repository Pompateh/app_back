import { SettingService } from './setting.service';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
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
    updateSetting(key: string, body: {
        value: string;
    }): Promise<{
        id: string;
        key: string;
        value: string;
    }>;
}
