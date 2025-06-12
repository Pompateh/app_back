export declare enum BlockTypeDto {
    TEXT = "text",
    FULL_IMAGE = "full_image",
    SIDE_BY_SIDE_IMAGE = "side_by_side_image",
    TEXT_AND_SIDE_IMAGE = "text_and_side_image",
    THREE_GRID_LAYOUT = "three_grid_layout"
}
export declare class ContentBlockDto {
    type: BlockTypeDto;
    layout?: 'left' | 'right';
    text?: string;
    src?: string;
    alt?: string;
    data?: Record<string, any>;
}
export declare class TeamMemberDto {
    name: string;
    role: string;
}
export declare class CreateProjectDto {
    title: string;
    slug: string;
    type: string;
    description: string;
    studioId: string;
    userId: string;
    category?: string;
    thumbnail?: string;
    blocks: ContentBlockDto[];
    team: TeamMemberDto[];
}
