export const BODIES={
 transparent:{asset:"original-v2",name:"SnakeBonD transparente fumée",size:[880,573],left:[220,325,64],right:[659,325,64],window:[40,200,800,250]},
 original:{asset:'original-v2',name:'SnakeBonD originale · intégrée',size:[880,573],label:[0,0,0,0],paper:'#ded0ae',ink:'#35291f',cover:[56,48,148],text:[232,105,565,32],left:[220,277,64],right:[659,277,64],window:[340,234,199,85],date:null},
 metal:{name:'Métal noir · fenêtre ovale',size:[468,307],label:[28,29,390,60],paper:'#353636',ink:'#e0c398',cover:[32,33,49],text:[90,49,315,15],left:[139,136,49],right:[324,137,30],window:[188,98,90,78],date:null},
 blue:{name:'Coque noire · papier bleu',size:[468,304],label:[43,43,368,43],paper:'#e7e5dc',ink:'#233c72',cover:[45,44,40],text:[95,60,305,15],left:[138,134,40],right:[324,134,40],window:[188,111,85,42],date:[367,173,58,36]},
 vintage:{name:'Vintage graphite · index ivoire',size:[463,303],label:[85,40,327,43],paper:'#e8e7e2',ink:'#2b4278',cover:[43,43,38],text:[96,58,303,15],left:[138,131,39],right:[324,131,39],window:[187,109,85,41],date:[76,169,64,30]},
 clearblue:{name:'Coque bleue translucide',size:[463,310],label:[94,48,319,44],paper:'#e7e9e6',ink:'#234f86',cover:[44,49,42],text:[104,66,298,15],left:[138,139,40],right:[325,139,40],window:[187,117,85,42],date:[44,185,57,32]},
 chrome:{name:'Chrome fumé · grandes bobines blanches',size:[292,187],label:[24,29,241,19],paper:'#eee7d9',ink:'#20355c',cover:[26,29,19],text:[51,37,207,9],left:[88,82,31],right:[201,82,31],window:[121,66,47,34],date:[29,111,29,18]},
 smoked:{name:'Noire transparente · mécanisme apparent',size:[293,189],label:[66,16,191,29],paper:'#272a29',ink:'#d0c593',cover:[25,17,26],text:[74,27,175,10],left:[87,85,38],right:[201,85,38],window:[126,63,32,46],date:[49,110,46,27]},
 white:{name:'Coque blanche · métal',size:[289,192],label:[70,13,172,53],paper:'#dddcd8',ink:'#252528',cover:[30,22,34],text:[81,35,150,12],left:[87,87,22],right:[200,87,22],window:[115,81,58,12],date:[126,101,31,15]}
};
export function automaticBody(key,used=[]){const ids=Object.keys(BODIES);let n=2166136261;for(const c of key)n=Math.imul(n^c.charCodeAt(0),16777619);const start=(n>>>0)%ids.length;const ordered=Array.from({length:ids.length},(_,i)=>ids[(start+i)%ids.length]);return ordered.find(id=>!used.includes(id))||ids[start]}
export function nextBody(id){const ids=Object.keys(BODIES);return ids[(ids.indexOf(id)+1)%ids.length]}
