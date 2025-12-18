(async ()=>{
  try{
    const url = process.env.NEXT_HOME_URL || 'http://localhost:3001/';
    const res = await fetch(url);
    const txt = await res.text();
    console.log(txt.slice(0,2000));
  }catch(e){
    console.error('ERROR',e.message||e);
    process.exit(1);
  }
})();
