const { PrismaClient } = require('@prisma/client');

(async () => {
  try {
    const db = new PrismaClient();
    const posts = await db.post.findMany({ orderBy: { publishedAt: 'desc' } });
    console.log(JSON.stringify({ edges: posts.map(p => ({ node: p })) }, null, 2));
    await db.$disconnect();
  } catch (e) {
    console.error('ERROR:', e.message || e);
    process.exit(1);
  }
})();
