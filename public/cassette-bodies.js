import {validYear} from './year-utils.js';
import {BODIES} from './cassette-models.js';
import {tapeState,drawHub} from './tape-mechanics.js';
import {time} from './audio-utils.js';
import {drawSmokedInterior} from './smoked-shell.js';
export const ORIGINAL_FINISHES={classic:{name:'Noir / ivoire',tint:null,filter:'none'},silver:{name:'Argent',tint:'#a8b3be',filter:'grayscale(1)'},sunset:{name:'Bordeaux',tint:'#772d39',filter:'none'},smoke:{name:'Bleu pétrole',tint:'#256377',filter:'saturate(.4)'},olive:{name:'Vert olive',tint:'#61774b',filter:'none'},cobalt:{name:'Bleu cobalt',tint:'#365fba',filter:'none'},plum:{name:'Prune',tint:'#8a4c83',filter:'none'},sand:{name:'Sable',tint:'#c6ac7f',filter:'none'}};
function finishedShell(image,finish,accent='#cb7666'){
 const c=document.createElement('canvas');c.width=880;c.height=573;const g=c.getContext('2d');g.filter=finish.filter;g.drawImage(image,0,0,880,573);g.filter='none';
 if(finish.tint){g.save();g.beginPath();g.rect(0,0,880,573);g.roundRect(40,40,800,322,25);g.clip('evenodd');g.globalCompositeOperation='screen';g.globalAlpha=finish===ORIGINAL_FINISHES.silver?.55:.36;g.fillStyle=finish.tint;g.fillRect(0,0,880,573);g.restore()}
 // Chamfered label with a continuous light paper surface.
 g.save();g.beginPath();g.moveTo(62,40);g.lineTo(818,40);g.lineTo(840,62);g.lineTo(840,373);g.lineTo(818,395);g.lineTo(62,395);g.lineTo(40,373);g.lineTo(40,62);g.closePath();g.clip();
 g.drawImage(image,120,100,1250,180,40,40,800,355);g.fillStyle='#f7efd955';g.fillRect(40,40,800,355);
 g.fillStyle=accent;for(const y of [205,257,309])g.fillRect(40,y,800,15);
 g.save();g.beginPath();g.roundRect(145,201,590,151,74);g.clip();g.drawImage(image,120,350,1290,286,68.75,195.85,739.06,160.04);g.restore();
 g.strokeStyle='#5f5a4d66';g.lineWidth=.8;for(const y of [116,158]){g.beginPath();g.moveTo(224,y);g.lineTo(817,y);g.stroke()}
 g.fillStyle='#292d29';g.font='11px Arial';g.fillText('NORMAL POSITION  ·  TYPE I',57,385);
 g.beginPath();g.moveTo(409,375);g.lineTo(438,375);g.lineTo(438,370);g.lineTo(453,380);g.lineTo(438,390);g.lineTo(438,385);g.lineTo(409,385);g.closePath();g.fill();g.restore();
 // Restore the photographed screw heads after tinting the plastic.
 // Neutral silver highlights preserve the original recesses and Phillips slots.
 g.save();g.beginPath();for(const [x,y] of [[27,25],[853,26],[27,540],[853,540],[440,466]]){g.moveTo(x+17,y);g.arc(x,y,17,0,Math.PI*2)}g.clip();g.filter='grayscale(1) brightness(2.2)';g.drawImage(image,0,0,880,573);g.restore();
 return c;
}
export async function loadBodyImages(){const result={};await Promise.all(Object.keys(BODIES).map(id=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{result[id]=img;resolve()};img.onerror=()=>reject(Error('Cassette indisponible : '+id));img.src='assets/cassettes/'+(BODIES[id].asset||id)+'.png'})));result.originalFinishes=Object.fromEntries(Object.entries(ORIGINAL_FINISHES).map(([key,finish])=>[key,finishedShell(result.original,finish)]));return result}
function fit(g,text,x,y,width,size,ink,font='Georgia'){g.fillStyle=ink;g.font=`${size}px ${font}`;while(g.measureText(text).width>width&&size>7){g.font=`${--size}px ${font}`}while(g.measureText(text).width>width&&text.length>1)text=text.slice(0,-2)+'…';g.fillText(text,x,y)}
export function clearCassetteBay(g){
 // Cover the entire baked-in shell, including its screws and bottom lip.
 g.save();g.beginPath();g.roundRect(25,366,892,580,24);g.fillStyle='#080909';g.fill();g.restore();
}

function drawDeckHardware(g){
 // Deck hardware is visible through the shell apertures, never painted over their rims.
 for(const [x,y,r] of [[215,522,24],[665,522,24]]){
  g.save();g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.clip();g.fillStyle='#080909';g.fillRect(x-r,y-r,r*2,r*2);
  const steel=g.createRadialGradient(x-4,y-5,1,x,y,13);steel.addColorStop(0,'#f1eee0');steel.addColorStop(.35,'#bfc2bd');steel.addColorStop(.7,'#555e60');steel.addColorStop(1,'#171d1e');g.fillStyle=steel;g.beginPath();g.arc(x,y,13,0,Math.PI*2);g.fill();g.strokeStyle='#b9b9a780';g.lineWidth=1;g.stroke();g.restore();
 }
 for(const x of [313,566]){
  g.save();g.beginPath();g.roundRect(x-18,495,36,38,8);g.clip();g.fillStyle='#080a0b';g.fillRect(x-18,495,36,38);
  const plastic=g.createLinearGradient(x-9,0,x+9,0);plastic.addColorStop(0,'#080909');plastic.addColorStop(.35,'#303333');plastic.addColorStop(.65,'#171919');plastic.addColorStop(1,'#090a0a');g.fillStyle=plastic;g.beginPath();g.roundRect(x-9,504,18,30,6);g.fill();g.strokeStyle='#454949';g.lineWidth=.8;g.beginPath();g.moveTo(x-5,507);g.quadraticCurveTo(x,504,x+5,507);g.stroke();g.restore();
 }
 // Only the polished crown of the playback head peeks above the lower tape slot.
 g.fillStyle='#080909';g.beginPath();g.roundRect(386,564,108,9,3);g.fill();
 const head=g.createLinearGradient(0,565,0,576);head.addColorStop(0,'#d8d6c7');head.addColorStop(.25,'#7a8587');head.addColorStop(.7,'#333c3e');head.addColorStop(1,'#111718');g.fillStyle=head;g.beginPath();g.roundRect(416,566,48,13,5);g.fill();g.fillStyle='#232a2b';g.fillRect(439,567,1,6);
}

export function drawBody(g,images,id,cover,artist,title,p,duration,accent,theme='classic',year=''){
 const m=BODIES[id];let img=images[id];if(!m||!img)return;
 if(id==='transparent'){
  clearCassetteBay(g);g.save();g.translate(31,370);g.beginPath();g.roundRect(0,0,880,573,24);g.clip();
  const finish=ORIGINAL_FINISHES[theme]||ORIGINAL_FINISHES.classic,color=/^#[\da-f]{6}$/i.test(accent)?accent:'#cb7666',key=theme+color;
  if(images.accentShell?.key!==key)images.accentShell={key,image:finishedShell(images.original,finish,color)};
  g.drawImage(images.accentShell.image,0,0);drawSmokedInterior(g,p,duration,finish.tint,color);drawDeckHardware(g);
  if(cover){const d=Math.min(cover.width,cover.height);g.drawImage(cover,(cover.width-d)/2,(cover.height-d)/2,d,d,56,48,148,148)}
  g.save();g.textAlign='center';const left=cover?232:64,right=817;fit(g,artist||'ARTISTE',(left+right)/2,105,right-left-20,32,'#243f82','"Segoe Print", "Comic Sans MS", cursive');fit(g,title||'TITRE',(left+right)/2,147,right-left-20,27,'#243f82','"Segoe Print", "Comic Sans MS", cursive');g.restore();
  if(validYear(year)){g.save();g.translate(772,458);g.rotate(-.17);g.fillStyle='#faf5df';g.fillRect(-45,-19,90,38);g.fillStyle='#52534d';g.font='24px "Segoe Print", cursive';g.textAlign='center';g.fillText(validYear(year),0,9);g.restore()}
  g.restore();return;
 }
 if(id==='original'){
  const finish=ORIGINAL_FINISHES[theme]||ORIGINAL_FINISHES.classic,color=/^#[\da-f]{6}$/i.test(accent)?accent:'#cb7666',key=theme+color;
  // Rebuild only when the finish or accent changes, never on every audio frame.
  if(images.accentShell?.key!==key)images.accentShell={key,image:finishedShell(images.original,finish,color)};
  img=images.accentShell.image;
 }
 clearCassetteBay(g);
 const [w,h]=m.size,s=id==='original'?1:Math.min(864/w,557/h);g.save();g.translate(id==='original'?31:39+(864-w*s)/2,id==='original'?370:378+(557-h*s)/2);g.scale(s,s);
 if(id==='original'){g.beginPath();g.roundRect(0,0,880,573,24);g.clip()}
 g.drawImage(img,0,0,w,h);
 if(id==='original'){drawDeckHardware(g);g.fillStyle='#292d29';g.font='19px Arial';g.fillText(duration?time(duration):'—:—',620,387)}
 // Personalised writable area covers the reference artist, not the shell.
 const [lx,ly,lw,lh]=m.label;g.fillStyle=m.paper;g.fillRect(lx,ly,lw,lh);
 g.fillStyle='#ffffff0b';for(let n=0;n<500;n++)g.fillRect(lx+(n*17.23)%lw,ly+(n*31.7)%lh,.6,.6);
 if(cover){const [cx,cy,cs]=m.cover,d=Math.min(cover.width,cover.height);g.drawImage(cover,(cover.width-d)/2,(cover.height-d)/2,d,d,cx,cy,cs,cs)}
 const [tx,ty,tw,ts]=m.text;const ink=id==='original'?'#243f82':m.ink,font=id==='original'?'"Segoe Print", "Comic Sans MS", cursive':'Georgia';if(id==='original'){g.save();g.textAlign='center';const left=cover?tx:64,right=817,centre=(left+right)/2,width=right-left-20;fit(g,artist||'ARTISTE',centre,ty,width,ts,ink,font);fit(g,title||'TITRE',centre,ty+ts*1.3,width,ts*.85,ink,font);g.restore()}else{fit(g,artist||'ARTISTE',tx,ty,tw,ts,ink,font);fit(g,title||'TITRE',tx+3,ty+ts*1.3,tw-3,ts*.85,ink,font)}
 if(id==='original'&&validYear(year)){g.save();g.translate(763,403);g.rotate(-.17);g.shadowColor='#0006';g.shadowBlur=3;g.shadowOffsetY=2;g.fillStyle='#faf5df';g.beginPath();g.roundRect(-48,-22,96,43,3);g.fill();g.shadowColor='transparent';g.fillStyle='#52534d';g.font='24px "Segoe Print", cursive';g.textAlign='center';g.fillText(validYear(year),0,8);g.restore()}
 if(id!=='original'){g.fillStyle=accent;g.fillRect(tx,ly+lh-2,Math.min(tw,lw-6),1)}
 if(m.date){const [dx,dy,dw,dh]=m.date;g.fillStyle='#ddd9cc';g.fillRect(dx,dy,dw,dh);fit(g,time(duration),dx+3,dy+dh*.72,dw-6,dh*.6,'#302d27')}
 // Replace every visible old hub, so no photographic teeth remain beneath it.
 const state=tapeState(p,duration),ratio=(m.right[0]-m.left[0])/367;
 const [wx,wy,ww,wh]=m.window;g.save();g.beginPath();g.roundRect(wx,wy,ww,wh,Math.min(4,wh/4));g.clip();
 const light=g.createLinearGradient(wx,0,wx+ww,0);light.addColorStop(0,'#57452e');light.addColorStop(.5,'#d4a256');light.addColorStop(1,'#62513d');g.fillStyle=light;g.fillRect(wx,wy,ww,wh);
 for(const [centre,r] of [[m.left,state.leftRadius],[m.right,state.rightRadius]]){const radius=r*ratio;g.beginPath();g.arc(centre[0],centre[1],radius,0,Math.PI*2);g.fillStyle='#372b23';g.fill();g.strokeStyle='#ba99712d';g.lineWidth=.4;for(let ring=80*ratio;ring<radius;ring+=1.5){g.beginPath();g.arc(centre[0],centre[1],ring,0,Math.PI*2);g.stroke()}}
 g.restore();
 for(const [centre,angle] of [[m.left,state.leftAngle],[m.right,state.rightAngle]]){g.save();g.translate(centre[0],centre[1]);g.scale(centre[2]/70,centre[2]/70);drawHub(g,0,0,angle);g.restore()}
 g.restore();
}
