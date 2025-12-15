(async () => {
  try {
    const cms = await fetch('http://localhost:4000/api/posts', { timeout: 5000 }).then(r => r.json()).catch(e => ({ error: String(e) }));
    console.log('CMS:', JSON.stringify(cms).slice(0, 1000));
  } catch (e) {
    console.error('CMS fetch error', e);
  }
  try {
    const next = await fetch('http://localhost:3000/', { timeout: 5000 }).then(r => r.text()).catch(e => ({ error: String(e) }));
    if (typeof next === 'string') console.log('NEXT: html length', next.length);
    else console.log('NEXT:', next);
  } catch (e) {
    console.error('NEXT fetch error', e);
  }
})();
