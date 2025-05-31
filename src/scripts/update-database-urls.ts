import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function updateDatabaseUrls() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prisma = new PrismaClient();
  const cloudinaryCloudName = configService.get<string>('CLOUDINARY_CLOUD_NAME');

  if (!cloudinaryCloudName) {
    console.error('CLOUDINARY_CLOUD_NAME is not set. Please ensure it is configured in your environment variables.');
    await prisma.$disconnect();
    await app.close();
    process.exit(1);
  }

  const getCloudinaryUrl = (filename: string) => {
    if (!filename) return null;
    // Assuming public ID is the filename without extension
    const parts = filename.split('.');
    const publicId = parts[0];
    const resourceType = filename.endsWith('.mp4') || filename.endsWith('.mov') ? 'video' : 'image';
    const extension = parts.length > 1 ? parts.pop() : '';
    // Construct Cloudinary URL
     return `https://res.cloudinary.com/${cloudinaryCloudName}/${resourceType}/upload/${publicId}${extension ? '.' + extension : ''}`;
  };

  try {
    console.log('Starting database URL update...');

    // Update Studio records
    // Fetch all studios and filter/update in memory due to complex JSON querying
    const allStudios = await prisma.studio.findMany();
    const studiosToUpdate = allStudios.filter(studio => 
        studio.thumbnail?.startsWith('/uploads/') || 
        studio.logo?.startsWith('/uploads/') ||
        (Array.isArray(studio.portfolio) && studio.portfolio.some((item: any) => item.image?.startsWith('/uploads/')))
         ||
        (Array.isArray(studio.artworks) && studio.artworks.some((item: any) => item.image?.startsWith('/uploads/')))
    );

    console.log(`Found ${studiosToUpdate.length} studios to update.`);

    for (const studio of studiosToUpdate) {
      let needsUpdate = false;
      const updatedData: any = {};

      if (studio.thumbnail?.startsWith('/uploads/')) {
        const filename = studio.thumbnail.split('/').pop() || '';
        updatedData.thumbnail = getCloudinaryUrl(filename);
        needsUpdate = true;
      }

      if (studio.logo?.startsWith('/uploads/')) {
        const filename = studio.logo.split('/').pop() || '';
        updatedData.logo = getCloudinaryUrl(filename);
        needsUpdate = true;
      }

      // Handle portfolio array - assuming it's stored as JSON
      if (Array.isArray(studio.portfolio)) {
         const updatedPortfolio = studio.portfolio.map((item: any) => {
            if (item.image?.startsWith('/uploads/')) {
               const filename = item.image.split('/').pop() || '';
               return { ...item, image: getCloudinaryUrl(filename) };
            }
            return item;
         });
         // Only update if changes were made
         if (JSON.stringify(updatedPortfolio) !== JSON.stringify(studio.portfolio)) {
             updatedData.portfolio = updatedPortfolio;
             needsUpdate = true;
         }
      }
       // Handle artworks array - assuming it's stored as JSON
      if (Array.isArray(studio.artworks)) {
         const updatedArtworks = studio.artworks.map((item: any) => {
            if (item.image?.startsWith('/uploads/')) {
               const filename = item.image.split('/').pop() || '';
               return { ...item, image: getCloudinaryUrl(filename) };
            }
            return item;
         });
         // Only update if changes were made
         if (JSON.stringify(updatedArtworks) !== JSON.stringify(studio.artworks)) {
             updatedData.artworks = updatedArtworks;
             needsUpdate = true;
         }
      }

      if (needsUpdate) {
        await prisma.studio.update({
          where: { id: studio.id }, // Assuming studio has an 'id' field, adjust if using '_id'
          data: updatedData,
        });
        console.log(`Updated Studio ID: ${studio.id}`);
      }
    }

    // Update Post records
    const postsToUpdate = await prisma.post.findMany({
      where: {
        OR: [
          { featuredImage: { startsWith: '/uploads/' } },
          { referencePicUrl: { startsWith: '/uploads/' } },
        ]
      },
    });

    console.log(`Found ${postsToUpdate.length} posts to update.`);

    for (const post of postsToUpdate) {
      let needsUpdate = false;
      const updatedData: any = {};

      if (post.featuredImage?.startsWith('/uploads/')) {
        const filename = post.featuredImage.split('/').pop() || '';
        updatedData.featuredImage = getCloudinaryUrl(filename);
        needsUpdate = true;
      }

      if (post.referencePicUrl?.startsWith('/uploads/')) {
        const filename = post.referencePicUrl.split('/').pop() || '';
        updatedData.referencePicUrl = getCloudinaryUrl(filename);
        needsUpdate = true;
      }

      if (needsUpdate) {
         await prisma.post.update({
            where: { id: post.id }, // Assuming post has an 'id' field, adjust if using '_id'
            data: updatedData,
         });
         console.log(`Updated Post ID: ${post.id}`);
      }
    }

    // Update Project records
     // Fetch all projects and filter/update in memory due to complex JSON querying
    const allProjects = await prisma.project.findMany();
    const projectsToUpdate = allProjects.filter(project => 
        project.thumbnail?.startsWith('/uploads/') ||
         (Array.isArray((project as any).blocks) && (project as any).blocks.some((block: any) => 
            (block.type === 'image' || block.type === 'full_image' || block.type === 'side_by_side_image' || block.type === 'three_grid_layout' || block.type === 'text_and_side_image') && 
            block.src?.startsWith('/uploads/'))
        )
    );

     console.log(`Found ${projectsToUpdate.length} projects to update.`);

    for (const project of projectsToUpdate) {
      let needsUpdate = false;
      const updatedData: any = {};

       if (project.thumbnail?.startsWith('/uploads/')) {
        const filename = project.thumbnail.split('/').pop() || '';
        updatedData.thumbnail = getCloudinaryUrl(filename);
        needsUpdate = true;
      }

      // Handle blocks array - assuming it's stored as JSON or similar structure
      if (Array.isArray((project as any).blocks)) {
         const updatedBlocks = (project as any).blocks.map((block: any) => {
            // Assuming image blocks have a 'type' field and a 'src' field
            if ((block.type === 'image' || block.type === 'full_image' || block.type === 'side_by_side_image' || block.type === 'three_grid_layout' || block.type === 'text_and_side_image') && block.src?.startsWith('/uploads/')) {
               const filename = block.src.split('/').pop() || '';
               return { ...block, src: getCloudinaryUrl(filename) };
            }
            return block;
         });
          if (JSON.stringify(updatedBlocks) !== JSON.stringify((project as any).blocks)) {
             updatedData.blocks = updatedBlocks;
             needsUpdate = true;
         }
      }

      if (needsUpdate) {
         await prisma.project.update({
            where: { id: project.id }, // Assuming project has an 'id' field, adjust if using '_id'
            data: updatedData,
         });
         console.log(`Updated Project ID: ${project.id}`);
      }
    }

     // Update Asset records
    const assetsToUpdate = await prisma.asset.findMany({
      where: {
        url: { startsWith: '/uploads/' },
      },
    });

    console.log(`Found ${assetsToUpdate.length} assets to update.`);

    for (const asset of assetsToUpdate) {
      const filename = asset.url.split('/').pop() || '';
      const cloudinaryUrl = getCloudinaryUrl(filename);
      if (cloudinaryUrl) {
        await prisma.asset.update({
          where: { id: asset.id }, // Assuming asset has an 'id' field, adjust if using '_id'
          data: { url: cloudinaryUrl },
        });
        console.log(`Updated Asset ID: ${asset.id}`);
      }
    }

    console.log('Database URL update completed.');
  } catch (error) {
    console.error('Error updating database URLs:', error);
  } finally {
    await prisma.$disconnect();
    await app.close();
  }
}

updateDatabaseUrls().catch(console.error); 