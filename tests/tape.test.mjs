import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tapeState,CORE_RADIUS,FULL_RADIUS,drawTapeMechanism} from '../public/tape-mechanics.js';
test('supply empties and take-up fills over the complete song',()=>{const a=tapeState(0,240),b=tapeState(120,240),c=tapeState(240,240);assert.equal(a.leftRadius,FULL_RADIUS);assert.equal(a.rightRadius,CORE_RADIUS);assert.equal(b.leftRadius,b.rightRadius);assert.equal(c.leftRadius,CORE_RADIUS);assert.equal(c.rightRadius,FULL_RADIUS)});
test('tape quantity conserved at every position',()=>{for(let t=0;t<=240;t++){const s=tapeState(t,240);assert.ok(Math.abs(s.leftRadius**2+s.rightRadius**2-(FULL_RADIUS**2+CORE_RADIUS**2))<1e-8)}});
test('seeking and pause are deterministic, out-of-range positions clamp',()=>{assert.deepEqual(tapeState(60,240),tapeState(60,240));assert.deepEqual(tapeState(-1,240),tapeState(0,240));assert.deepEqual(tapeState(999,240),tapeState(240,240));assert.equal(tapeState(20,0).leftAngle,0);assert.equal(tapeState(60,240).progress,.25)});
test('angular velocity follows the changing radius on both reels',()=>{const dt=.001;for(const t of [10,120,230]){const a=tapeState(t,240),b=tapeState(t+dt,240);assert.ok(Math.abs((b.leftAngle-a.leftAngle)/dt+220/a.leftRadius)<.0001);assert.ok(Math.abs((b.rightAngle-a.rightAngle)/dt+220/a.rightRadius)<.0001)}});
test('rotating spokes always rotate around fixed reel centres without scaling',()=>{for(const t of [0,60,120,240]){const translations=[];let rotations=0;const gradient={addColorStop(){}};const g=new Proxy({translate(x,y){translations.push([x,y])},rotate(){rotations++},scale(){throw Error('elliptical transform')},createLinearGradient(){return gradient},createRadialGradient(){return gradient}},{get(o,k){return o[k]||(()=>{})}});drawTapeMechanism(g,t,240);assert.deepEqual(translations,[[292,649],[659,649]]);assert.equal(rotations,14)}});

test('forward transfer rotates both reels anticlockwise throughout the song',()=>{for(const t of [1,60,120,239]){const a=tapeState(t,240),b=tapeState(t+.1,240);assert.ok(b.leftAngle<a.leftAngle);assert.ok(b.rightAngle<a.rightAngle)}});

test('rotors do not reuse photographed teeth under moving geometry',()=>{
 const gradient={addColorStop(){}};let teeth=0;
 const g=new Proxy({drawImage(){throw Error('Static photographed teeth must not be drawn')},closePath(){teeth++},createLinearGradient(){return gradient},createRadialGradient(){return gradient}},{get(o,k){return o[k]||(()=>{})}});
 drawTapeMechanism(g,53,240,{width:941,height:1672});assert.equal(teeth,12);
});
