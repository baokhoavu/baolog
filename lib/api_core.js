import getClient from './sanity';
import { fetchFromCms, normalizeListResponse, toNode } from './api/utils';

let mock = null;
try { 
  mock = require('./mock'); 
} catch (e) { 
  mock = null; 
}

const client = (() => {
  try { return getClient(); } catch (e) { return null; }
})();
const HAS_SANITY = !!client;
const CMS_API_URL = process.env.CMS_API_URL || null;

export async function getPreviewPost(id) {
  if (CMS_API_URL) {
    const r = await fetchFromCms(`/posts/${id}`);
    return r?.post || r?.data || r || null;
  }
  // Local mock fallback
  if (mock && typeof mock.getPost === 'function') {
    try { const m = mock.getPost(id); if (m) return m; } catch (e) { /* ignore */ }
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
  // Mock fallback
  if (mock && typeof mock.getAllPosts === 'function') {
    try { const posts = mock.getAllPosts(); return { edges: posts.map(p => ({ node: { slug: p.slug } })) }; } catch (e) { /* ignore */ }
  }
  if (!HAS_SANITY) return { edges: [] };
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return { edges: posts.map(p => ({ node: p })) };
}

export async function getAllPostsForHome(preview = false) {
  if (CMS_API_URL) {
    const r = await fetchFromCms('/posts');
    if (r) {
      const edges = normalizeListResponse(r);
      return { edges: edges.map(e => ({ node: toNode(e.node) })) };
    }
  }
  
  // Mock fallback - load posts from data/mock-posts.json
  if (mock && typeof mock.getAllPosts === 'function') {
    try {
      const posts = mock.getAllPosts();
      return { edges: posts.map(p => ({ node: toNode(p) })) };
    } catch (e) {
      // ignore
    }
  }
  
  if (HAS_SANITY) {
    const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0..19]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}, body}`);
    return { edges: posts.map(p => ({ node: toNode(p) })) };
  }
  
  return { edges: [] };
}

export async function getPostAndMorePosts(slug, preview = false, previewData = null) {
  if (CMS_API_URL) {
    const r = await fetchFromCms(`/posts/${slug}`);
    const post = r?.post || r?.data || r || null;
    const recentR = await fetchFromCms('/posts');
    const recent = normalizeListResponse(recentR);
    return {
      post: toNode(post || {}),
      posts: { edges: recent.filter(x => x && x.node && ((x.node.slug && (x.node.slug === slug || x.node.slug.current === slug)) ? false : true)).map(x => ({ node: toNode(x.node) })) }
    };
  }
  // Mock fallback
  if (mock && typeof mock.getPost === 'function' && typeof mock.getAllPosts === 'function') {
    try {
      const mpost = mock.getPost(slug);
      const all = mock.getAllPosts();
      const recent = all.filter(p => p && p.slug !== slug).slice(0, 3);
      return { post: toNode(mpost || {}), posts: { edges: recent.map(p => ({ node: toNode(p) })) } };
    } catch (e) { /* ignore */ }
  }
  if (!HAS_SANITY) return { post: toNode({}), posts: { edges: [] } };
  const post = await client.fetch('*[_type == "post" && slug.current == $slug][0]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}, body}', { slug });
  const recent = await client.fetch('*[_type == "post"] | order(publishedAt desc)[0..2]{title, excerpt, "slug": slug.current, publishedAt, mainImage, "author": author->{name, firstName, lastName, image}, "categories": categories[]->{title}, "tags": tags[]->{title}}');
  return { post: toNode(post || {}), posts: { edges: recent.filter(p => p && p.slug !== slug).map(p => ({ node: toNode(p) })) } };
}
