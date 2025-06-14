import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostController {
    private readonly postService;
    private readonly logger;
    constructor(postService: PostService);
    findAll(): Promise<{
        additionalContent: any;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string | null;
        thumbnail: string | null;
        slug: string;
        content: string | null;
        summary: string | null;
        featuredImage: string | null;
        published: boolean;
        referencePicUrl: string | null;
        referencePicName: string | null;
        authorName: string | null;
        authorJobTitle: string | null;
        postDate: Date | null;
        readingTime: string | null;
        contentSources: string[];
        quote: string | null;
        quoteAuthor: string | null;
        publishedAt: Date | null;
        version: number;
        isDraft: boolean;
    }[]>;
    findOne(slug: string): Promise<{
        additionalContent: any;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string | null;
        thumbnail: string | null;
        slug: string;
        content: string | null;
        summary: string | null;
        featuredImage: string | null;
        published: boolean;
        referencePicUrl: string | null;
        referencePicName: string | null;
        authorName: string | null;
        authorJobTitle: string | null;
        postDate: Date | null;
        readingTime: string | null;
        contentSources: string[];
        quote: string | null;
        quoteAuthor: string | null;
        publishedAt: Date | null;
        version: number;
        isDraft: boolean;
    }>;
    create(createPostDto: CreatePostDto): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            type: string | null;
            thumbnail: string | null;
            slug: string;
            content: string | null;
            summary: string | null;
            featuredImage: string | null;
            published: boolean;
            referencePicUrl: string | null;
            referencePicName: string | null;
            authorName: string | null;
            authorJobTitle: string | null;
            postDate: Date | null;
            readingTime: string | null;
            contentSources: string[];
            additionalContent: import("@prisma/client/runtime/library").JsonValue;
            quote: string | null;
            quoteAuthor: string | null;
            publishedAt: Date | null;
            version: number;
            isDraft: boolean;
        };
    }>;
    update(id: string, updatePostDto: UpdatePostDto): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            type: string | null;
            thumbnail: string | null;
            slug: string;
            content: string | null;
            summary: string | null;
            featuredImage: string | null;
            published: boolean;
            referencePicUrl: string | null;
            referencePicName: string | null;
            authorName: string | null;
            authorJobTitle: string | null;
            postDate: Date | null;
            readingTime: string | null;
            contentSources: string[];
            additionalContent: import("@prisma/client/runtime/library").JsonValue;
            quote: string | null;
            quoteAuthor: string | null;
            publishedAt: Date | null;
            version: number;
            isDraft: boolean;
        };
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            type: string | null;
            thumbnail: string | null;
            slug: string;
            content: string | null;
            summary: string | null;
            featuredImage: string | null;
            published: boolean;
            referencePicUrl: string | null;
            referencePicName: string | null;
            authorName: string | null;
            authorJobTitle: string | null;
            postDate: Date | null;
            readingTime: string | null;
            contentSources: string[];
            additionalContent: import("@prisma/client/runtime/library").JsonValue;
            quote: string | null;
            quoteAuthor: string | null;
            publishedAt: Date | null;
            version: number;
            isDraft: boolean;
        };
    }>;
}
