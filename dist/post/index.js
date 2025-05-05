"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const post_service_1 = require("./post.service");
const postService = new post_service_1.PostService();
async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const posts = await postService.findAll();
            res.status(200).json(posts);
        }
        catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
//# sourceMappingURL=index.js.map