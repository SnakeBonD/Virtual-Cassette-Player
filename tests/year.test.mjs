import {test} from 'node:test';import assert from 'node:assert/strict';import {chooseYear,validYear} from '../public/year-utils.js';
const recording=(year,extra={})=>({id:'12345678-1234-1234-1234-123456789012',score:100,title:'Da Funk','artist-credit':[{name:'Daft Punk'}],'first-release-date':year,...extra});
test('accepts a dated exact artist/title match and returns its source',()=>{const result=chooseYear({recordings:[recording('1995-05-08')]},'DAFT PUNK','Da funk');assert.equal(result.year,'1995');assert.ok(result.url.startsWith('https://musicbrainz.org/recording/'))});
test('rejects a cover, a live version, fuzzy matches',()=>{for(const recordings of [[recording('1995',{'artist-credit':[{name:'Someone else'}]})],[recording('1995',{disambiguation:'live'})],[recording('1995',{score:80})]])assert.equal(chooseYear({recordings},'Daft Punk','Da Funk').year,'')});
test('missing or malformed dates never become sticker years',()=>{for(const v of ['',null,'0000','9999','199x','2026oops'])assert.equal(validYear(v),'');assert.equal(chooseYear({recordings:[]},'Artist','Song').year,'')});

test('prefers the first release to a later reissue',()=>{assert.equal(chooseYear({recordings:[recording('2000'),recording('1995')]},'Daft Punk','Da Funk').year,'1995')});
