import {THEMES,appearance} from './themes.js';
import {drawTapeMechanism} from './tape-mechanics.js';
/** Fixed deck surfaces. All positions remain in the 941 × 1672 reference space. */
export function createSurfaces(deck) {
 const panel=document.createElement('canvas'); panel.width=900;panel.height=476;
 const c=panel.getContext('2d');
 // Use the blank brushed-metal header across the entire physical panel.
 for(let y=0;y<476;y+=28)c.drawImage(deck,25,8,900,28,0,y,900,28);
 const shade=c.createLinearGradient(0,0,0,476);shade.addColorStop(0,'#0003');shade.addColorStop(1,'#0009');c.fillStyle=shade;c.fillRect(0,0,900,476);
 return panel;
}
function rounded(g,x,y,w,h,r,fill){g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill()}
function fit(g,value,x,y,maxWidth,size,color,font='Arial') {
 g.fillStyle=color;let s=size;g.font=`${s}px ${font}`;
 while(g.measureText(value).width>maxWidth&&s>18){s--;g.font=`${s}px ${font}`}
 let line=value;while(g.measureText(line).width>maxWidth&&line.length>1)line=line.slice(0,-2)+'…';g.fillText(line,x,y);
}
export function retroCassette(g,deck,cover,artist,title,p,duration,style) {
 const selected=appearance(style),theme=THEMES[selected.theme],accent=selected.accent;
 const rgb=accent.slice(1).match(/../g).map(v=>parseInt(v,16));const accentInk=(rgb[0]*.299+rgb[1]*.587+rgb[2]*.114)>145?'#20201e':'#f0e9da';
 g.save();g.beginPath();g.roundRect(83,425,779,367,27);g.clip();
 const paper=g.createLinearGradient(0,425,0,792);paper.addColorStop(0,theme.paper);paper.addColorStop(1,theme.paper);g.fillStyle=paper;g.fillRect(83,425,779,367);
 // Fine paper grain, deterministic between frames.
 for(let n=0;n<3600;n++){const x=83+(n*137.31)%779,y=425+(n*73.17)%367;g.fillStyle=n%2?'#ffffff07':'#30292012';g.fillRect(x,y,1.6,.7)}
 g.fillStyle=accent;g.fillRect(83,438,779,13);g.fillRect(83,547,779,9);
 g.fillStyle=theme.shell;g.fillRect(83,565,779,166);
 // Real plastic grain from the source cassette, blended into the chosen shell colour.
 g.save();g.globalCompositeOperation='soft-light';g.globalAlpha=.7;g.drawImage(deck,190,815,555,42,83,565,779,166);g.restore();
 if(selected.theme==='smoke'){g.save();g.globalAlpha=.18;g.strokeStyle='#d0bf97';g.lineWidth=3;for(const x of [292,659]){for(const r of [86,98,110]){g.beginPath();g.arc(x,649,r,0,Math.PI*2);g.stroke()}}g.restore()}
 for(let stripe=1;stripe<theme.stripes;stripe++){g.fillStyle=accent;g.fillRect(83,547-stripe*7,779,3)}
 g.fillStyle=accent;g.fillRect(83,740,779,38);
 g.fillStyle=theme.ink;g.fillRect(83,732,779,5);
 if(cover){const d=Math.min(cover.width,cover.height);g.drawImage(cover,(cover.width-d)/2,(cover.height-d)/2,d,d,101,450,104,104)}
 const left=cover?226:112;
 fit(g,artist||'ARTISTE',left,491,720-left,30,theme.ink,theme.font);
 fit(g,title||'TITRE',left,532,720-left,25,theme.ink,theme.font);
 rounded(g,763,463,72,66,3,'#292627');fit(g,'A',782,514,40,48,'#e2ddce');
 fit(g,'STEREO  •  NORMAL BIAS',110,768,460,19,accentInk);fit(g,'C—90',717,768,120,26,accentInk);
 // Deterministic transport driven by the audio clock and full track duration.
 drawTapeMechanism(g,p,duration,deck);
 // Fixed raking light and worn label edges add depth without moving highlights.
 const sheen=g.createLinearGradient(0,425,0,792);sheen.addColorStop(0,'#ffffff24');sheen.addColorStop(.12,'#ffffff00');sheen.addColorStop(.85,'#00000000');sheen.addColorStop(1,'#00000055');g.fillStyle=sheen;g.fillRect(83,425,779,367);
 g.lineWidth=2;g.strokeStyle='#ffffff38';g.beginPath();g.roundRect(85,427,775,363,25);g.stroke();
 g.restore();
}
export function trackSurface(g,deck,panel){
 g.save();g.beginPath();g.roundRect(22,970,900,476,16);g.clip();g.drawImage(panel,22,970);
 // Restore hardware as circular elements, not rectangular image patches.
 for(const [x,y,r] of [[105,1327,59],[270,1327,84],[473,1327,104],[670,1327,84],[836,1327,59],[39,988,20],[907,987,20],[40,1423,18],[904,1424,18]]){g.save();g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.clip();g.drawImage(deck,x-r,y-r,r*2,r*2,x-r,y-r,r*2,r*2);g.restore()}
 g.restore();
}

