import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bounds,peaks,rms,time} from '../public/audio-utils.js';
test('rejects invalid and out-of-track excerpts',()=>{for(const args of [[0,0,10],[-1,5,10],[0,12,10],[NaN,5,10]])assert.throws(()=>bounds(...args));assert.deepEqual(bounds(2,8,10),{start:2,end:8})});
test('waveform preserves transients and silence',()=>{assert.deepEqual(peaks(new Float32Array([0,1,0,-.5]),2),[1,.5]);assert.deepEqual(peaks(new Float32Array(100),4),[0,0,0,0])});
test('stereo level computation and end boundary',()=>{assert.equal(rms(new Float32Array([1,-1]),0),1);assert.equal(rms(new Float32Array(5),5),0);assert.equal(time(125.5),'2:05')});
