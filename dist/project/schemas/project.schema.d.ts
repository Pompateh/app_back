import { Document } from 'mongoose';
export type ProjectDocument = Project & Document;
export declare class Project {
    id: string;
    title: string;
    slug: string;
    type: string;
    description: string;
    category: string;
    thumbnail: string;
    blocks: any[];
    team: any[];
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project> & Project & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>> & import("mongoose").FlatRecord<Project> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
