const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.post.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      title: 'Hello World (seed)',
      slug: 'hello-world',
      excerpt: 'This is a seeded post for local testing.',
      content: '<p>Seeded content — replace with your own.</p>',
      publishedAt: new Date(),
    },
  });
  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
