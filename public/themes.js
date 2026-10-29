import {BODIES} from './cassette-models.js';
export const THEMES={
 classic:{name:'Crème / bordeaux',paper:'#d4cbb5',ink:'#2a2523',accent:'#602b3e',shell:'#292626',font:'Arial',stripes:1},
 silver:{name:'Noir / argent',paper:'#25282a',ink:'#e0dfd7',accent:'#a5abb1',shell:'#17191a',font:'Arial',stripes:3},
 sunset:{name:'Ivoire / orange',paper:'#e0d5b9',ink:'#332a20',accent:'#b85224',shell:'#302820',font:'Georgia',stripes:3},
 smoke:{name:'Transparent fumé',paper:'#34332f',ink:'#e6dfc8',accent:'#a4936d',shell:'#171c1c',font:'Arial',stripes:2},
 olive:{name:'Vert olive',paper:'#e1dcc9',ink:'#272a20',accent:'#63734b',shell:'#3b4930',font:'Arial',stripes:1},
 cobalt:{name:'Bleu cobalt',paper:'#e3e4df',ink:'#253049',accent:'#426bb0',shell:'#284d91',font:'Arial',stripes:1},
 plum:{name:'Prune',paper:'#e5dcdf',ink:'#382637',accent:'#825779',shell:'#65365e',font:'Arial',stripes:1},
 sand:{name:'Sable',paper:'#ebe4d3',ink:'#3b3021',accent:'#9a8156',shell:'#a28c64',font:'Arial',stripes:1},
 electric:{name:'Bleu électrique',paper:'#f5eedc',ink:'#243f82',accent:'#246bfa',shell:'#246bfa',font:'Arial',stripes:3},
 turquoise:{name:'Turquoise vif',paper:'#f5eedc',ink:'#243f82',accent:'#168c82',shell:'#09cbb5',font:'Arial',stripes:3},
 coral:{name:'Rouge corail',paper:'#f5eedc',ink:'#243f82',accent:'#c43b49',shell:'#f74753',font:'Arial',stripes:3},
 tangerine:{name:'Orange mandarine',paper:'#f5eedc',ink:'#243f82',accent:'#dd6e1c',shell:'#ff861b',font:'Arial',stripes:3},
 violet:{name:'Violet pop',paper:'#f5eedc',ink:'#243f82',accent:'#8544bc',shell:'#a64cf3',font:'Arial',stripes:3},
 lemon:{name:'Jaune solaire',paper:'#f5eedc',ink:'#243f82',accent:'#b99728',shell:'#f5d234',font:'Arial',stripes:3}
};
export function appearance(value={}){const theme=Object.hasOwn(THEMES,value?.theme)?value.theme:'classic';return {...(Object.hasOwn(BODIES,value?.body)||value?.body==='studio'?{body:value.body}:{}),theme,accent:/^#[\da-f]{6}$/i.test(value?.accent)?value.accent:THEMES[theme].accent}}
export function readAppearance(storage,key){try{return appearance(JSON.parse(storage.getItem('snakebond:appearance:'+key)||'{}'))}catch{return appearance()}}
export function writeAppearance(storage,key,value){try{storage.setItem('snakebond:appearance:'+key,JSON.stringify(appearance(value)));return true}catch{return false}}
export function coverAccent(img){const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');g.drawImage(img,0,0,32,32);const data=g.getImageData(0,0,32,32).data;const bins=new Map();for(let i=0;i<data.length;i+=4){const rgb=[data[i],data[i+1],data[i+2]],max=Math.max(...rgb),min=Math.min(...rgb);if(data[i+3]<128||max<45||min>220||max-min<25)continue;const key=rgb.map(v=>Math.min(255,Math.round(v/32)*32)).join(',');bins.set(key,(bins.get(key)||0)+1)}const best=[...bins].sort((a,b)=>b[1]-a[1])[0];return best?'#'+best[0].split(',').map(v=>(+v).toString(16).padStart(2,'0')).join(''):null}
