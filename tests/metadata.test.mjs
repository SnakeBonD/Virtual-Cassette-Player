import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readTrackTags,fallbackNames} from '../src/metadata.js';
const base=await readFile(new URL('../public/assets/liora.mp3',import.meta.url));
const oldSize=10+((base[6]<<21)|(base[7]<<14)|(base[8]<<7)|base[9]);
const audio=base.subarray(oldSize,base.subarray(-128,-125).toString()==='TAG'?base.length-128:base.length);
function tagged(version,encoding,artist,title,year){
 const frames=[];
 for(const [id,value] of [['TPE1',artist],['TIT2',title],...(year?[[version===4?'TDRC':'TYER',year]]:[])]){
  let bytes=Buffer.from(value,encoding===1?'utf16le':'utf8');if(encoding===1)bytes=Buffer.concat([Buffer.from([255,254]),bytes]);
  const payload=Buffer.concat([Buffer.from([encoding]),bytes]);const header=Buffer.alloc(10);header.write(id);if(version===4){let n=payload.length;header[4]=(n>>21)&127;header[5]=(n>>14)&127;header[6]=(n>>7)&127;header[7]=n&127}else header.writeUInt32BE(payload.length,4);frames.push(header,payload)
 }
 const data=Buffer.concat(frames),header=Buffer.from([73,68,51,version,0,0,(data.length>>21)&127,(data.length>>14)&127,(data.length>>7)&127,data.length&127]);return new Blob([header,data,audio],{type:'audio/mpeg'});
}
test('ID3v2.3 UTF16 tags override misleading filename',async()=>{const t=await readTrackTags(tagged(3,1,'DAFT PUNK','Da funk'),'01 WRONG — Wrong [320kbps].mp3');assert.equal(t.artist,'DAFT PUNK');assert.equal(t.title,'Da funk');assert.equal(t.warning,'')});
test('ID3v2.4 UTF8 accents preserved',async()=>{const t=await readTrackTags(tagged(4,3,'Björk','Jóga'),'wrong.mp3');assert.equal(t.artist,'Björk');assert.equal(t.title,'Jóga')});
test('bundled browser parser reads real embedded LIORA metadata and art',async()=>{const {readTrackTags:read}=await import('../public/metadata.js');const t=await read(new Blob([base],{type:'audio/mpeg'}),'wrong.mp3');assert.equal(t.artist,'LIORA AIOVA');assert.equal(t.title,'Liora');assert.ok(t.coverBlob.size>1000)});
test('ID3v1 artist/title',async()=>{const tag=Buffer.alloc(128);tag.write('TAG');tag.write('Tagged title',3);tag.write('Tagged artist',33);const t=await readTrackTags(new Blob([audio,tag],{type:'audio/mpeg'}),'wrong.mp3');assert.equal(t.artist,'Tagged artist');assert.equal(t.title,'Tagged title')});
test('missing tags explicitly fall back to cleaned filename',async()=>{assert.deepEqual(fallbackNames('1-4. DAFT PUNK — Da funk [320kbps].mp3'),{artist:'DAFT PUNK',title:'Da funk'});const t=await readTrackTags(new Blob(['broken'],{type:'audio/mpeg'}),'01 Unknown.mp3');assert.equal(t.artist,'');assert.equal(t.title,'Unknown');assert.ok(t.warning)});

test('YEAR and recording-date tags are exposed to the sticker',async()=>{assert.equal((await readTrackTags(tagged(3,1,'ABBA','Song','1980'))).year,'1980');assert.equal((await readTrackTags(tagged(4,3,'Artist','Song','1990-04-12'))).year,'1990');assert.equal((await readTrackTags(tagged(3,1,'Artist','Song'))).year,'')});
