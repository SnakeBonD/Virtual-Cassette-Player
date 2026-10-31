import {test} from 'node:test';import assert from 'node:assert/strict';
import {parseTimeInput,formatTimeInput,presetRange,fadeEnvelope,envelopeAt,scheduleFades,nextTrackIndex,VIDEO_QUALITIES} from '../public/studio-settings.js';
test('time entry accepts seconds and minutes without silent invalid coercion',()=>{assert.equal(parseTimeInput('1:30,5'),90.5);assert.equal(parseTimeInput('90.5'),90.5);for(const v of ['', '-1','1:60','1:2:3','abc','Infinity'])assert.throws(()=>parseTimeInput(v));assert.equal(formatTimeInput(59.999),'1:00');assert.equal(formatTimeInput(92.25),'1:32.25')});
test('presets apply from the selected start and clamp to track duration',()=>{assert.deepEqual(presetRange(30,60,120),{start:30,end:90});assert.deepEqual(presetRange(110,60,120),{start:110,end:120});assert.throws(()=>presetRange(120,15,120))});
test('fades have correct amplitude at boundaries and after seeking',()=>{const p=fadeEnvelope(10,2,3);assert.equal(envelopeAt(p,0),0);assert.equal(envelopeAt(p,1),.5);assert.equal(envelopeAt(p,5),1);assert.equal(envelopeAt(p,8.5),.5);assert.equal(envelopeAt(p,10),0);const calls=[];scheduleFades({cancelScheduledValues:(...a)=>calls.push(['cancel',...a]),setValueAtTime:(...a)=>calls.push(['set',...a]),linearRampToValueAtTime:(...a)=>calls.push(['ramp',...a])},100,8.5,p);assert.deepEqual(calls,[['cancel',100],['set',.5,100],['ramp',0,101.5]])});
test('overlapping fades fit short clips and disabled fades keep unity gain',()=>{assert.deepEqual(fadeEnvelope(2,2,2),[[0,0],[1,1],[2,0]]);assert.equal(envelopeAt(fadeEnvelope(5,0,0),3),1);assert.throws(()=>fadeEnvelope(5,-1,0));assert.throws(()=>fadeEnvelope(5,NaN,0))});
test('jukebox sequential end, repeat and shuffle cycle without immediate repeats',()=>{assert.equal(nextTrackIndex(3,0),1);assert.equal(nextTrackIndex(3,2),-1);assert.equal(nextTrackIndex(3,2,{repeat:true}),0);assert.equal(nextTrackIndex(3,0,{shuffle:true,history:[0,1]},()=>0),2);assert.equal(nextTrackIndex(3,2,{shuffle:true,history:[0,1,2]}),-1);assert.notEqual(nextTrackIndex(3,2,{shuffle:true,repeat:true,history:[0,1,2]},()=>0),2);assert.equal(nextTrackIndex(1,0,{shuffle:true,repeat:true}),0);assert.equal(nextTrackIndex(0,-1),-1)});
test('both video quality profiles are portrait 9:16 with distinct bitrates',()=>{for(const q of Object.values(VIDEO_QUALITIES))assert.equal(q.width/q.height,9/16);assert.ok(VIDEO_QUALITIES.high.videoBitsPerSecond>VIDEO_QUALITIES.standard.videoBitsPerSecond)});


test('video filename preserves readable metadata and matches the export container',async()=>{
 const {videoFilename}=await import('../public/studio-settings.js');
 assert.equal(videoFilename('Philip Oakey & Giorgio Moroder','Together In Electric Dreams','1984'),'Philip Oakey & Giorgio Moroder - Together In Electric Dreams (1984).mp4');
 assert.equal(videoFilename('Björk','Jóga','','video/webm;codecs=vp9,opus'),'Björk - Jóga.webm');
 assert.equal(videoFilename('AC/DC','Who: What?','not a year'),'AC DC - Who What.mp4');
 assert.equal(videoFilename('','',''),'Artiste inconnu - Sans titre.mp4');
});
