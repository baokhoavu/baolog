import { urlFor } from '../sanity';

const CACHE_TTL = 5000; // ms
const FETCH_TIMEOUT_MS = 10000; // ms

if (!global.__BAOLOG_CMS_CACHE__) global.__BAOLOG_CMS_CACHE__ = new Map();

export async function fetchFromCms(path) {
  const CMS_API_URL = process.env.CMS_API_URL || null;
  if (!CMS_API_URL) return null;

  const cache = global.__BAOLOG_CMS_CACHE__;
  const key = path;
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && now - entry.ts < CACHE_TTL) return entry.val;

  const base = CMS_API_URL.replace(/\/$/, '');
  const apiPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
  const url = `${base}${apiPath}`;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const signal = controller ? controller.signal : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, signal });
    if (controller) clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    cache.set(key, { val: json, ts: Date.now() });
    return json;
  } catch (err) {
    if (controller) clearTimeout(timeout);
    return null;
  }
}

export function normalizeListResponse(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res.map(node => ({ node }));
  if (res.edges && Array.isArray(res.edges)) return res.edges;
  if (res.posts && Array.isArray(res.posts)) return res.posts.map(node => ({ node }));
  if (res.data && Array.isArray(res.data)) return res.data.map(node => ({ node }));
  const firstArray = Object.values(res).find(v => Array.isArray(v));
  return firstArray ? firstArray.map(node => ({ node })) : [];
}

export function urlOrNull(img) {
  // Accepts a string (URL) or an object (Sanity image or { url })
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  try { return urlFor(img).url() } catch { return null }
}

export function toNode(p = {}) {
  return {
    title: p.title || '',
    excerpt: p.excerpt || '',
    slug: (p.slug && (typeof p.slug === 'string' ? p.slug : p.slug.current)) || p.slug || p.id || '',
    date: p.publishedAt || p.published_at || p._createdAt || '',
    featuredImage: { node: { sourceUrl: urlOrNull(p.mainImage || p.featuredImage) } },
    author: p.author ? { node: { name: p.author.name || null, avatar: { url: urlOrNull(p.author.image) } } } : null,
    categories: { edges: (p.categories || []).map(c => ({ node: { name: c.title || c.name } })) },
    tags: { edges: (p.tags || []).map(t => ({ node: { name: t.title || t } })) },
    content: p.body || p.content || '',
  };
}
