(async ()=>{
  try{
    const res = await fetch('http://localhost:3001/');
    const txt = await res.text();
    console.log(txt.slice(0,2000));
  }catch(e){
    console.error('ERROR',e.message||e);
    process.exit(1);
  }
})();
