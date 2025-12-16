// Simple local mock adapter for development/fallback.
// Keeps a minimal API surface similar to remote CMS responses.
const path = require('path');
const data = require('../data/mock-posts.json');

function getAllPosts() {
  return (data.posts || []).slice();
}

function getAllPostsEdges() {
  return getAllPosts().map(p => ({ node: p }));
}

function findPost(idOrSlug) {
  const posts = getAllPosts();
  return posts.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

module.exports = {
  // returns array of posts
  getAllPosts,
  // returns { edges: [ { node: post }, ... ] }
  getAllPostsEdges,
  // returns post object or null
  getPost: findPost,
};
