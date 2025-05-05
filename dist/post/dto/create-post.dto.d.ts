export declare class CreatePostDto {
    title: string;
    slug: string;
    summary?: string;
    featuredImage?: string;
    published: boolean;
    content?: string;
    referencePicUrl?: string;
    referencePicName?: string;
    authorName?: string;
    authorJobTitle?: string;
    postDate?: string;
    readingTime?: string;
    contentSources?: string[];
    additionalContent?: {
        title: string;
        paragraph: string;
    }[];
    quote?: string;
    quoteAuthor?: string;
    type?: string;
    publishedAt?: string;
}
