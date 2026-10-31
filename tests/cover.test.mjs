import {test} from 'node:test';
import assert from 'node:assert/strict';
import {coverCandidates,lookupCover} from '../cover-service.mjs';
const id='12345678-1234-1234-1234-123456789abc';
const recording={score:100,title:'Da Funk','artist-credit':[{name:'Daft Punk',artist:{id:'artist'}}],releases:[{id,title:'Homework',date:'1997'}]};
const data={recordings:[recording]};
test('cover selection requires exact track artist and tagged album',()=>{
 assert.equal(coverCandidates(data,'DAFT PUNK','Da Funk','Homework').length,1);
 assert.equal(coverCandidates(data,'Other','Da Funk').length,0);
 assert.equal(coverCandidates(data,'Daft Punk','Da Funk','Discovery').length,0);
 assert.equal(coverCandidates({recordings:[{...recording,title:'Da Funk (Live)'}]},'Daft Punk','Da Funk').length,0);
});
test('cover selection rejects ambiguous artist identities and unsafe IDs',()=>{
 assert.equal(coverCandidates({recordings:[recording,{...recording,'artist-credit':[{name:'Daft Punk',artist:{id:'other'}}]}]},'Daft Punk','Da Funk').length,0);
 assert.equal(coverCandidates({recordings:[{...recording,releases:[{id:'../../bad',title:'Homework'}]}]},'Daft Punk','Da Funk').length,0);
});
test('cover service returns a bounded raster image and source, handles missing artwork',async()=>{
 const result=await lookupCover('Daft Punk','Da Funk','Homework',async()=>new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'image/jpeg'}}),async()=>data);
 assert.equal(result.image,'AQID');assert.equal(result.url,'https://musicbrainz.org/release/'+id);
 assert.deepEqual(await lookupCover('Daft Punk','Da Funk','',async()=>new Response('',{status:404}),async()=>data),{reason:'not-found'});
 await assert.rejects(lookupCover('Daft Punk','Da Funk','',async()=>new Response('<svg/>',{headers:{'content-type':'image/svg+xml'}}),async()=>data));
});
