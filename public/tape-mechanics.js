// A complete track represents one pass from the supply reel to the take-up reel.
// Tape length is proportional to annular area, not to the radius.
export const CORE_RADIUS=80;
export const FULL_RADIUS=235;
export function tapeState(seconds,duration){
 const elapsed=Number.isFinite(seconds)?Math.max(0,seconds):0;
 const total=Number.isFinite(duration)&&duration>0?duration:0;
 const t=total?Math.min(elapsed,total):0,progress=total?t/total:0;
 const area=FULL_RADIUS**2-CORE_RADIUS**2;
 const leftRadius=Math.sqrt(CORE_RADIUS**2+area*(1-progress));
 const rightRadius=Math.sqrt(CORE_RADIUS**2+area*progress);
 // Integral of v / radius(t): exact, independent of frame rate and seeking history.
 const tapeSpeed=220;
 return {progress,leftRadius,rightRadius,leftAngle:(-2*tapeSpeed*t/(FULL_RADIUS+leftRadius))||0,rightAngle:(-2*tapeSpeed*t/(CORE_RADIUS+rightRadius))||0};
}
function disc(g,x,y,r,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle=fill;g.fill()}
export function drawHub(g,x,y,angle){
 // All geometry shares one exact centre; lighting and the outer bezel never rotate.
 const rim=g.createRadialGradient(x-16,y-19,5,x,y,69);rim.addColorStop(0,'#f2eadd');rim.addColorStop(.49,'#625e58');rim.addColorStop(.69,'#d5cbbd');rim.addColorStop(.83,'#45433f');rim.addColorStop(.91,'#d3cbbd');rim.addColorStop(1,'#161717');
 disc(g,x,y,70,'#080909');disc(g,x,y,66,rim);
 // A clean concentric bezel replaces the photo crop, which contained old teeth.
 // No static tooth fragments remain underneath the animated rotor.
 disc(g,x,y,57,'#cbc7ba');disc(g,x,y,53,'#121312');
 g.save();g.translate(x,y);g.rotate(angle);
 for(let k=0;k<6;k++){g.save();g.rotate(k*Math.PI/3);g.beginPath();g.moveTo(-8,-54);g.lineTo(8,-54);g.lineTo(5,-28);g.lineTo(-5,-28);g.closePath();const tooth=g.createLinearGradient(-8,-54,8,-28);tooth.addColorStop(0,'#f1ecdc');tooth.addColorStop(.5,'#bbb8aa');tooth.addColorStop(1,'#a6a597');g.fillStyle=tooth;g.fill();g.restore()}
 g.restore();
 const cap=g.createRadialGradient(x-9,y-11,1,x,y,31);cap.addColorStop(0,'#a3a09a');cap.addColorStop(.25,'#484a48');cap.addColorStop(.65,'#151716');cap.addColorStop(.85,'#363936');cap.addColorStop(1,'#090b0a');disc(g,x,y,31,cap);disc(g,x,y,10,'#111412');disc(g,x,y,4,'#767871');
}
export function drawTapeMechanism(g,seconds,duration,deck){
 const state=tapeState(seconds,duration);
 g.save();g.beginPath();g.roundRect(213,574,532,149,65);g.clip();
 const well=g.createLinearGradient(0,574,0,723);well.addColorStop(0,'#090a09');well.addColorStop(.5,'#252724');well.addColorStop(1,'#080a09');g.fillStyle=well;g.fillRect(213,574,532,149);
 // Visible tape packs behind the central transparent window.
 g.save();g.beginPath();g.roundRect(389,584,181,127,9);g.clip();
 const light=g.createLinearGradient(389,0,570,0);light.addColorStop(0,'#69411c');light.addColorStop(.5,'#d39946');light.addColorStop(1,'#644020');g.fillStyle=light;g.fillRect(389,584,181,127);
 for(const [x,r] of [[292,state.leftRadius],[659,state.rightRadius]]){
  const roll=g.createRadialGradient(x,649,75,x,649,235);roll.addColorStop(0,'#17120e');roll.addColorStop(.65,'#3c2b20');roll.addColorStop(1,'#271b15');disc(g,x,649,r,roll);
  g.strokeStyle='#c6a08025';g.lineWidth=.65;
  for(let rr=82;rr<r;rr+=3){g.beginPath();g.arc(x,649,rr,0,Math.PI*2);g.stroke()}
 }
 const glass=g.createLinearGradient(0,584,0,711);glass.addColorStop(0,'#0009');glass.addColorStop(.3,'#ffffff0b');glass.addColorStop(.6,'#ffffff00');glass.addColorStop(1,'#0008');g.fillStyle=glass;g.fillRect(389,584,181,127);g.restore();
 g.strokeStyle='#75614b';g.lineWidth=2;g.beginPath();g.roundRect(389,584,181,127,9);g.stroke();
 drawHub(g,292,649,state.leftAngle);drawHub(g,659,649,state.rightAngle);
 g.restore();
}

