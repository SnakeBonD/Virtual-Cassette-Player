import {musicBrainzRecordings} from './cover-service.mjs';
import {chooseYear} from './public/year-utils.js';
const cache=new Map();let queue=Promise.resolve();
export function lookupYear(artist,title){
 const key=JSON.stringify([artist,title]);if(cache.has(key))return Promise.resolve(cache.get(key));
 const run=queue.then(async()=>{
  if(cache.has(key))return cache.get(key);
  const result=chooseYear(await musicBrainzRecordings(artist,title),artist,title);cache.set(key,result);if(cache.size>500)cache.delete(cache.keys().next().value);return result;
 });queue=run.catch(()=>{});return run;
}
