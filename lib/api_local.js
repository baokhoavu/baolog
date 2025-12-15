import getClient, { urlFor } from './sanity';

const client = getClient();
const HAS_SANITY = !!client;
const CMS_API_URL = process.env.CMS_API_URL || null;

if (!global.__BAOLOG_CMS_CACHE__) global.__BAOLOG_CMS_CACHE__ = new Map();

async function fetchFromCms(path) {
  if (!CMS_API_URL) return null;
  const cache = global.__BAOLOG_CMS_CACHE__;
  const key = path;
  const TTL = 5000;
  const now = Date.now();
  const c = cache.get(key);
  if (c && now - c.ts < TTL) return c.val;

  const base = CMS_API_URL.replace(/\/$/, '');
  const apiPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
  const url = `${base}${apiPath}`;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const signal = controller ? controller.signal : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), 10000) : null;
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, signal });
    if (controller) clearTimeout(timeout);
    if (!res.ok) return null;
    const j = await res.json();
    cache.set(key, { val: j, ts: Date.now() });
    return j;
  } catch (e) {
    if (controller) clearTimeout(timeout);
    return null;
  }
}

function normalizeListResponse(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res.map(node => ({ node }));
  if (res.edges && Array.isArray(res.edges)) return res.edges;
  if (res.posts && Array.isArray(res.posts)) return res.posts.map(node => ({ node }));
  if (res.data && Array.isArray(res.data)) return res.data.map(node => ({ node }));
  const firstArray = Object.values(res).find(v => Array.isArray(v));
  if (firstArray) return firstArray.map(node => ({ node }));
  return [];
}

function urlOrNull(img) {
  try { return img ? urlFor(img).url() : null } catch { return null }
}

function toNode(p = {}) {
  return {
    title: p.title || '',
    excerpt: p.excerpt || '',
    slug: (p.slug && (typeof p.slug === 'string' ? p.slug : p.slug.current)) || p.slug || p.id || '',
    date: p.publishedAt || p.published_at || p._createdAt || '',
    featuredImage: { node: { sourceUrl: urlOrNull(p.mainImage || p.featuredImage) } },
    author: { node: p.author ? { name: p.author.name || null, avatar: { url: urlOrNull(p.author.image) } } : null },
    categories: { edges: (p.categories || []).map(c => ({ node: { name: c.title || c.name } })) },
    tags: { edges: (p.tags || []).map(t => ({ node: { name: t.title || t } })) },
    content: p.body || p.content || '',
  };
}

export async function getPreviewPost(id) {
  if (CMS_API_URL) {
    const r = await fetchFromCms(`/posts/${id}`);
    return r?.post || r?.data || r || null;
  }
  if (!HAS_SANITY) return null;
  return (await client.fetch('*[_id == $id][0]', { id })) || null;
}

export async function getAllPostsWithSlug() {
  if (CMS_API_URL) {
    const r = await fetchFromCms('/posts');
    const edges = normalizeListResponse(r);
    return { edges: edges.map(e => ({ node: { slug: e.node?.slug || (e.node?.slug && e.node.slug.current) || e.node?.id } })) };
  }
  if (!HAS_SANITY) return { edges: [] };
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return { edges: posts.map(p => ({ node: p })) };
}

export async function getAllPostsForHome() {
  if (CMS_API_URL) {
    const r = await fetchFromCms('/posts');
    const edges = normalizeListResponse(r);
    return { edges: edges.map(e => ({ node: toNode(e.node) })) };
  }
  if (!HAS_SANITY) return { edges: [] };
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0..19]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}, body}`);
  return { edges: posts.map(p => ({ node: toNode(p) })) };
}

export async function getPostAndMorePosts(slug) {
  if (CMS_API_URL) {
    const r = await fetchFromCms(`/posts/${slug}`);
    const post = r?.post || r?.data || r || null;
    const recentR = await fetchFromCms('/posts');
    const recent = normalizeListResponse(recentR);
    return { post: toNode(post || {}), posts: { edges: recent.filter(x => x && x.node && ((x.node.slug && (x.node.slug === slug || x.node.slug.current === slug)) ? false : true)).map(x => ({ node: toNode(x.node) })) } };
  }
  if (!HAS_SANITY) return { post: toNode({}), posts: { edges: [] } };
  const post = await client.fetch('*[_type == "post" && slug.current == $slug][0]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}, body}', { slug });
  const recent = await client.fetch('*[_type == "post"] | order(publishedAt desc)[0..2]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}}');
  return { post: toNode(post || {}), posts: { edges: recent.filter(p => p && p.slug !== slug).map(p => ({ node: toNode(p) })) } };
}
