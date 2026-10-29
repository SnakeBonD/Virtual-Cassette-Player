import {chooseYear} from './public/year-utils.js';
const cache=new Map();let queue=Promise.resolve(),lastRequest=0;
const quote=s=>'"'+s.replace(/[\\"]/g,' ').trim()+'"';
export function lookupYear(artist,title){
 const key=JSON.stringify([artist,title]);if(cache.has(key))return Promise.resolve(cache.get(key));
 const run=queue.then(async()=>{
  if(cache.has(key))return cache.get(key);
  const wait=Math.max(0,1100-(Date.now()-lastRequest));if(wait)await new Promise(r=>setTimeout(r,wait));lastRequest=Date.now();
  const query='recording:'+quote(title)+' AND artist:'+quote(artist);
  const url=new URL('https://musicbrainz.org/ws/2/recording/');url.search=new URLSearchParams({query,fmt:'json',limit:'25'});
  const response=await fetch(url,{headers:{'User-Agent':'SnakeBonDStudio/0.9 (local desktop music visualizer)','Accept':'application/json'},signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('Service de recherche indisponible ('+response.status+').');
  const result=chooseYear(await response.json(),artist,title);cache.set(key,result);if(cache.size>500)cache.delete(cache.keys().next().value);return result;
 });queue=run.catch(()=>{});return run;
}
