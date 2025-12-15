(async () => {
  try {
    const api = await import('../lib/api_core.js');
    console.log('\nCalling getAllPostsForHome (api_core)...');
    const home = await api.getAllPostsForHome();
    console.log(JSON.stringify(home, null, 2));

    console.log('\nCalling getAllPostsWithSlug (api_core)...');
    const slugs = await api.getAllPostsWithSlug();
    console.log(JSON.stringify(slugs, null, 2));

    console.log('\nCalling getPreviewPost (api_core) for "post-1"...');
    const preview = await api.getPreviewPost('post-1');
    console.log(JSON.stringify(preview, null, 2));

    console.log('\nDone.');
  } catch (err) {
    console.error('Error running api_core tests:', err && err.stack ? err.stack : err);
  }
})();
