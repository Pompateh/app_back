import { PrismaClient, BlockType, Layout } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create three demo projects for related-post testing
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'Project One: Text and Image',
        slug: 'project-one-text-image',
        description: 'A simple project with text and an image.',
        thumbnail: 'https://example.com/thumb1.jpg',
        category: 'Demo',
        blocks: {
          create: [
            {
              type: BlockType.text,
              text: '<p>This is the first project, with just text.</p>',
              layout: Layout.left,
            },
            {
              type: BlockType.image,
              src: 'https://example.com/image1.jpg',
              layout: Layout.right,
            },
          ],
        },
        team: {
          create: [
            { name: 'Alice', role: 'Designer' },
            { name: 'Bob', role: 'Developer' },
          ],
        },
      },
    }),

    prisma.project.create({
      data: {
        title: 'Project Two: Full Banner and Side Images',
        slug: 'project-two-full-banner-side',
        thumbnail: 'https://example.com/thumb2.jpg',
        description: 'A project showcasing a full banner and side images.',
        category: 'Demo',
        blocks: {
          create: [
            {
              type: BlockType.full_image,
              src: 'https://example.com/banner.jpg',
              alt: 'Banner Image',
            },
            {
              type: BlockType.side_by_side_image,
              data: {
                images: [
                  { src: 'https://example.com/side1.jpg', layout: Layout.left },
                  { src: 'https://example.com/side2.jpg', layout: Layout.right },
                ],
              },
            },
          ],
        },
        team: {
          create: [
            { name: 'Carol', role: 'Manager' },
          ],
        },
      },
    }),

    prisma.project.create({
      data: {
        title: 'Project Three: Three Grid Showcase',
        slug: 'project-three-grid-showcase',
        description: 'A project with a three-grid layout showcasing various elements.',
        thumbnail: 'https://example.com/thumb3.jpg',
        category: 'Demo',
        blocks: {
          create: [
            {
              type: BlockType.three_grid_layout,
              data: {
                items: [
                  { type: 'text', text: '<h2>Top Left Text</h2>', layout: Layout.left },
                  { type: 'image', src: 'https://example.com/grid-bottom.jpg', alt: 'Bottom Left', layout: Layout.left },
                  { type: 'image', src: 'https://example.com/grid-right.jpg', alt: 'Right Panel', layout: Layout.right },
                ],
              },
            },
          ],
        },
        team: {
          create: [
            { name: 'Dave', role: 'Analyst' },
            { name: 'Eve', role: 'QA' },
          ],
        },
      },
    }),
  ]);

  console.log('Seeded projects:', projects.map(p => p.slug));
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
