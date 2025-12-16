(async () => {
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
    const preview = await api.getPreviewPost('post-1');
    console.log(JSON.stringify(preview, null, 2));

    console.log('\nCalling getPostAndMorePosts("post-1")...');
    const more = await api.getPostAndMorePosts('post-1');
    console.log(JSON.stringify(more, null, 2));

    console.log('\nDone.');
  } catch (err) {
    console.error('Error running api tests:', err);
  }
})();
