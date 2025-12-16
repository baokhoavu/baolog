(async () => {
  process.env.CMS_API_URL = 'http://localhost:4001';
  const http = require('http');
  const url = require('url');

  const mockData = {
    posts: [
      { id: '1', title: 'Post 1', slug: 'post-1', excerpt: 'Excerpt 1', publishedAt: '2025-01-01', mainImage: null, author: { name: 'Author 1', image: null }, categories: [], tags: [], body: 'Content 1' },
      { id: '2', title: 'Post 2', slug: 'post-2', excerpt: 'Excerpt 2', publishedAt: '2025-01-02', mainImage: null, author: { name: 'Author 2', image: null }, categories: [], tags: [], body: 'Content 2' }
    ]
  };

  const server = http.createServer((req, res) => {
    const p = url.parse(req.url, true);
    if (req.method === 'GET' && p.pathname === '/api/posts') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ edges: mockData.posts.map(p => ({ node: p })) }));
      return;
    }
    const match = p.pathname.match(/^\/api\/posts\/(.+)$/);
    if (req.method === 'GET' && match) {
      const slug = match[1];
      const post = mockData.posts.find(x => x.slug === slug || x.id === slug);
      if (!post) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ post }));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  server.listen(4001, async () => {
    console.log('Mock CMS running on http://localhost:4001');
    try {
      const apiModule = await import('../lib/api.mjs');
      const api = apiModule;
      console.log('\nCalling getAllPostsWithSlug...');
      const slugs = await api.getAllPostsWithSlug();
      console.log(JSON.stringify(slugs, null, 2));

      console.log('\nCalling getAllPostsForHome...');
      const home = await api.getAllPostsForHome();
      console.log(JSON.stringify(home, null, 2));

      console.log('\nCalling getPreviewPost(1)...');
      const preview = await api.getPreviewPost('1');
      console.log(JSON.stringify(preview, null, 2));

      console.log('\nCalling getPostAndMorePosts("post-1")...');
      const more = await api.getPostAndMorePosts('post-1');
      console.log(JSON.stringify(more, null, 2));

      console.log('\nAll tests finished.');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close(() => process.exit(0));
    }
  });
})();
