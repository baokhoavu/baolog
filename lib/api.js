// Minimal requires: keep imports simple for linting/intellisense
const fs = (() => { try { return require('fs'); } catch (e) { return null; } })();

const mock = (() => {
  try { return require('./mock'); } catch (e) { return { getAllPosts: () => [], getPost: () => null }; }
})();

// Attempt to load Sanity; fall back silently to keep runtime stable
let client = null;
let urlFor = (img) => ({ url: () => null });
try {
  const sanity = require('./sanity');
  const getClient = sanity && (sanity.default || sanity.getClient || sanity);
  client = typeof getClient === 'function' ? getClient() : null;
  if (sanity && sanity.urlFor) urlFor = sanity.urlFor;
} catch (e) {
  // quiet fallback
}

const HAS_SANITY = !!client;

// Config / globals
const CMS_API_URL = process.env.CMS_API_URL || null;
if (!global.__BAOLOG_CMS_CACHE__) global.__BAOLOG_CMS_CACHE__ = new Map();
if (!global.__BAOLOG_CMS_ATTEMPTS__) global.__BAOLOG_CMS_ATTEMPTS__ = new Map();

// Simple file logger (best-effort)
function writeLog(line) {
  // Prefer file logging when possible, otherwise emit to console so logs are visible
  if (!fs) {
    try { console.error('[api]', line); } catch (e) { /* ignore */ }
    return;
  }
  try {
    const dir = 'logs';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.appendFileSync(`${dir}/api.log`, `${new Date().toISOString()} ${line}\n`);
  } catch (e) {
    try { console.warn('[api]', 'log error', e && e.message ? e.message : e); } catch (e2) { /* ignore */ }
  }
}

async function fetchFromCms(path) {
  if (!CMS_API_URL) return null;
  const cache = global.__BAOLOG_CMS_CACHE__;
  const attempts = global.__BAOLOG_CMS_ATTEMPTS__;
  const key = path;
  const now = Date.now();
  const c = cache.get(key);
  if (c && now - c.ts < 5000) return c.val;

  const seen = attempts.get(key) || 0;
  if (seen >= 3) {
    writeLog(`fetchFromCms: too many attempts for ${key}`);
    return null;
  }

  const base = CMS_API_URL.replace(/\/$/, '');
  const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) {
      writeLog(`fetchFromCms: non-ok ${res.status} ${url}`);
      attempts.set(key, seen + 1);
      return null;
    }
    const ver = res.headers?.get ? (res.headers.get('etag') || res.headers.get('x-content-version')) : null;
    const j = await res.json();
    if (c && c.ver && ver && c.ver === ver) {
      cache.set(key, { val: c.val, ts: Date.now(), ver: c.ver });
      attempts.set(key, 0);
      return c.val;
    }
    cache.set(key, { val: j, ts: Date.now(), ver: ver || j?.version || null });
    attempts.set(key, 0);
    return j;
  } catch (e) {
    writeLog(`fetchFromCms error for ${url}: ${e && e.message ? e.message : String(e)}`);
    attempts.set(key, seen + 1);
    return null;
  }
}

function urlOrNull(img) {
  try { return img ? urlFor(img).url() : null; } catch { return null; }
}

function toNode(p = {}) {
  return {
    title: p.title || '',
    excerpt: p.excerpt || '',
    slug: (p.slug && (typeof p.slug === 'string' ? p.slug : p.slug.current)) || p.slug || p.id || '',
    date: p.publishedAt || p.published_at || p._createdAt || '',
    featuredImage: { node: { sourceUrl: urlOrNull(p.mainImage || p.featuredImage) } },
    author: p.author ? { node: { name: p.author.name || null, avatar: { url: urlOrNull(p.author.image) } } } : { node: null },
    categories: { edges: (p.categories || []).map(c => ({ node: { name: c.title || c.name } })) },
    tags: { edges: (p.tags || []).map(t => ({ node: { name: t.title || t } })) },
    content: p.body || p.content || '',
  };
}

export async function getPreviewPost(id) {
  // Try remote CMS first
  if (CMS_API_URL) {
    const r = await fetchFromCms(`/posts/${id}`);
    if (r?.post) return r.post;
    // otherwise fallthrough to mock/sanity
  }

  // Mock fallback (local JSON)
  try {
    const m = mock.getPost(id);
    if (m) return m;
  } catch (e) {
    /* ignore */
  }

  // Sanity fallback
  if (!HAS_SANITY) return null;
  return (await client.fetch('*[_id == $id][0]', { id })) || null;
}

export async function getAllPostsWithSlug() {
  if (CMS_API_URL) {
    const r = await fetchFromCms('/posts');
    const edges = r?.edges || [];
    if (edges.length) return { edges: edges.map(e => ({ node: { slug: e.node.slug } })) };
    // fall through to mock if remote returned nothing
  }

  // Mock fallback
  try {
    const posts = mock.getAllPosts();
    return { edges: posts.map(p => ({ node: { slug: p.slug } })) };
  } catch (e) {
    /* ignore */
  }

  // Sanity fallback
  if (!HAS_SANITY) return { edges: [] };
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return { edges: posts.map(p => ({ node: p })) };
}

export async function getAllPostsForHome() {
  if (CMS_API_URL) {
    const r = await fetchFromCms('/posts');
    const edges = r?.edges || [];
    if (edges.length) return { edges: edges.map(e => ({ node: toNode(e.node) })) };
    // fall through to mock
  }

  // Mock fallback
  try {
    const posts = mock.getAllPosts();
    return { edges: posts.map(p => ({ node: toNode(p) })) };
  } catch (e) {
    /* ignore */
  }

  // Sanity fallback
  if (!HAS_SANITY) return { edges: [] };
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0..19]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}, body}`);
  return { edges: posts.map(p => ({ node: toNode(p) })) };
}

export async function getPostAndMorePosts(slug) {
  if (CMS_API_URL) {
    const r = await fetchFromCms(`/posts/${slug}`);
    const post = r?.post || null;
    const recentR = await fetchFromCms('/posts');
    const recent = recentR?.edges || [];
    if (post) return { post: toNode(post || {}), posts: { edges: recent.filter(x => x && x.node && x.node.slug !== slug).map(x => ({ node: toNode(x.node) })) } };
    // fall through to mock
  }

  // Mock fallback
  try {
    const mpost = mock.getPost(slug);
    const all = mock.getAllPosts();
    const recent = all.filter(p => p && p.slug !== slug).slice(0, 3);
    return { post: toNode(mpost || {}), posts: { edges: recent.map(p => ({ node: toNode(p) })) } };
  } catch (e) {
    /* ignore */
  }

  // Sanity fallback
  if (!HAS_SANITY) return { post: toNode({}), posts: { edges: [] } };
  const post = await client.fetch('*[_type == "post" && slug.current == $slug][0]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}, body}', { slug });
  const recent = await client.fetch('*[_type == "post"] | order(publishedAt desc)[0..2]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}}');
  return { post: toNode(post || {}), posts: { edges: recent.filter(p => p && p.slug !== slug).map(p => ({ node: toNode(p) })) } };
}
