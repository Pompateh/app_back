import { NextApiRequest, NextApiResponse } from 'next';
import { PostService } from './post.service'; // Adjust the import path as necessary

const postService = new PostService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log('Received ID:', id); // Log the ID

  if (req.method === 'PUT') {
    try {
      const updatePostDto = req.body;

      // Ensure featuredImage, referencePicUrl, and referencePicName are included in the update
      const { featuredImage, referencePicUrl, referencePicName, ...otherFields } = updatePostDto;

      const updatedPost = await postService.update(id as string, {
        ...otherFields,
        featuredImage, // Include featuredImage in the update
        referencePicUrl, // Include referencePicUrl in the update
        referencePicName, // Include referencePicName in the update
      });

      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}