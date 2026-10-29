import {tapeState,drawHub,CORE_RADIUS,FULL_RADIUS} from './tape-mechanics.js';
import {time} from './audio-utils.js';

// The animated mechanism is rendered underneath one continuous smoked window.
// It uses the same area-conserving tape transfer and rotation as the original.
export function drawSmokedInterior(g,seconds,duration,tint,accent){
 const state=tapeState(seconds,duration);
 g.save();g.beginPath();g.roundRect(40,200,800,250,18);g.clip();
 const well=g.createLinearGradient(0,200,0,450);well.addColorStop(0,'#161b1e');well.addColorStop(.5,'#3a4245');well.addColorStop(1,'#15191b');g.fillStyle=well;g.fillRect(40,200,800,250);
 // Moulded ribs and guides behind the tape packs.
 g.strokeStyle='#929c9d38';g.lineWidth=3;
 for(const x of [73,111,398,482,768,807]){g.beginPath();g.moveTo(x,205);g.lineTo(x,421);g.stroke()}
 g.strokeStyle='#0b0e10';g.lineWidth=7;g.beginPath();g.moveTo(105,327);g.lineTo(90,431);g.quadraticCurveTo(90,439,101,439);g.lineTo(777,439);g.quadraticCurveTo(789,439,789,431);g.lineTo(774,327);g.stroke();
 for(const [x,radius,angle] of [[220,state.leftRadius,state.leftAngle],[659,state.rightRadius,state.rightAngle]]){
  const r=Math.sqrt(64**2+(radius**2-CORE_RADIUS**2)/(FULL_RADIUS**2-CORE_RADIUS**2)*(117**2-64**2));
  const roll=g.createRadialGradient(x,325,62,x,325,117);roll.addColorStop(0,'#211812');roll.addColorStop(.55,'#554032');roll.addColorStop(1,'#221c18');
  g.fillStyle=roll;g.beginPath();g.arc(x,325,r,0,Math.PI*2);g.fill();
  g.strokeStyle='#d2b69a30';g.lineWidth=.6;for(let rr=65;rr<r;rr+=1.7){g.beginPath();g.arc(x,325,rr,0,Math.PI*2);g.stroke()}
  // Transparent reel flange, concentric with the hub; highlights remain stationary.
  g.strokeStyle='#c7d3d63d';g.lineWidth=2;g.beginPath();g.arc(x,325,119,0,Math.PI*2);g.stroke();
  g.save();g.translate(x,325);g.rotate(angle);g.strokeStyle='#c2cdcf22';g.lineWidth=5;
  for(let i=0;i<3;i++){g.rotate(Math.PI*2/3);g.beginPath();g.moveTo(70,0);g.lineTo(110,0);g.stroke()}g.restore();
 }
 for(const x of [90,789]){const steel=g.createRadialGradient(x-3,428,1,x,432,10);steel.addColorStop(0,'#c7d0cb');steel.addColorStop(1,'#202729');g.fillStyle=steel;g.beginPath();g.arc(x,432,10,0,Math.PI*2);g.fill()}
 // Subtle tinted glazing, rather than an opaque colour over the mechanism.
 g.fillStyle=tint||'#6e7f86';g.globalAlpha=.13;g.fillRect(40,200,800,250);g.globalAlpha=1;
 const glass=g.createLinearGradient(0,200,0,450);glass.addColorStop(0,'#e7f1f323');glass.addColorStop(.23,'#ffffff05');glass.addColorStop(.7,'#00000008');glass.addColorStop(1,'#00000055');g.fillStyle=glass;g.fillRect(40,200,800,250);
 g.strokeStyle='#c5d5d51b';g.lineWidth=16;g.beginPath();g.moveTo(364,200);g.lineTo(297,450);g.moveTo(595,200);g.lineTo(528,450);g.stroke();
 g.restore();
 g.strokeStyle='#080b0c';g.lineWidth=5;g.beginPath();g.roundRect(40,200,800,250,18);g.stroke();g.strokeStyle='#b6c4c459';g.lineWidth=1;g.stroke();
 for(const [x,angle] of [[220,state.leftAngle],[659,state.rightAngle]]){g.save();g.translate(x,325);g.scale(64/70,64/70);drawHub(g,0,0,angle);g.restore()}
 g.fillStyle=accent;g.fillRect(55,188,770,5);
 g.textAlign='center';g.fillStyle='#e4e4d8';g.font='12px Arial';g.fillText('S / B   •   SMOKED SERIES',440,246);g.font='20px Arial';g.fillText(duration?time(duration):'—:—',440,409);g.textAlign='start';
}
