// Uniform scaling keeps the circular reels round in both 9:16 compositions.
export function frameTransform(mode){
 if(mode==='safe')return {x:60,y:180,scale:840/941};
 const scale=Math.max(1080/941,1920/1672);
 return {x:(1080-941*scale)/2,y:(1920-1672*scale)/2,scale};
}
