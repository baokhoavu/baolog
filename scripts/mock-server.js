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

const port = process.env.MOCK_PORT || 4001;
server.listen(port, () => {
  console.log(`Mock CMS running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down mock server');
  server.close(() => process.exit(0));
});
