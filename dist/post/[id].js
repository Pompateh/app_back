"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const post_service_1 = require("./post.service");
const postService = new post_service_1.PostService();
async function handler(req, res) {
    const { id } = req.query;
    console.log('Received ID:', id);
    if (req.method === 'PUT') {
        try {
            const updatePostDto = req.body;
            const { featuredImage, referencePicUrl, referencePicName, ...otherFields } = updatePostDto;
            const updatedPost = await postService.update(id, {
                ...otherFields,
                featuredImage,
                referencePicUrl,
                referencePicName,
            });
            if (!updatedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).json(updatedPost);
        }
        catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
    else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
//# sourceMappingURL=%5Bid%5D.js.map