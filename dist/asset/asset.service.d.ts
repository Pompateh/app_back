export declare class AssetService {
    private prisma;
    createAsset(data: {
        url: string;
        filename: string;
        caption?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }[]>;
    updateAsset(id: string, updateData: {
        caption?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }>;
    removeAsset(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }>;
}
