import {validYear} from './year-utils.js';
export const VIDEO_QUALITIES={standard:{name:'Standard · 720 × 1280',width:720,height:1280,videoBitsPerSecond:4000000,audioBitsPerSecond:128000},high:{name:'Haute · 1080 × 1920',width:1080,height:1920,videoBitsPerSecond:8000000,audioBitsPerSecond:192000}};
export function parseTimeInput(value){
 const text=String(value).trim().replace(',','.');
 if(/^\d+(?:\.\d+)?$/.test(text))return Number(text);
 const match=/^(\d+):([0-5]?\d(?:\.\d+)?)$/.exec(text);
 if(!match)throw Error('Utilisez minutes:secondes (ex. 1:30) ou un nombre de secondes.');
 return Number(match[1])*60+Number(match[2]);
}
export function formatTimeInput(seconds){const ticks=Math.round(Math.max(0,seconds)*100),minutes=Math.floor(ticks/6000),remainder=ticks%6000;return `${minutes}:${(remainder/100).toFixed(remainder%100?2:0).padStart(remainder%100?5:2,'0')}`}
export function presetRange(start,seconds,duration){if(!Number.isFinite(start)||start<0||start>=duration)throw Error('Le début doit précéder la fin de la chanson.');return {start,end:Math.min(duration,start+seconds)}}
// Short clips proportionally shorten overlapping fades, so the envelope remains continuous.
export function fadeEnvelope(duration,fadeIn=0,fadeOut=0){
 if(!Number.isFinite(duration)||duration<=0)throw Error('Durée de fondu invalide.');
 let a=Number(fadeIn),b=Number(fadeOut);if(!Number.isFinite(a)||!Number.isFinite(b)||a<0||b<0)throw Error('Les fondus doivent être des durées positives ou nulles.');
 if(a+b>duration){const scale=duration/(a+b);a*=scale;b*=scale}
 const points=[[0,a?0:1]];if(a)points.push([a,1]);if(b){if(duration-b>a)points.push([duration-b,1]);points.push([duration,0])}else points.push([duration,1]);return points;
}
export function envelopeAt(points,position){if(position<=0)return points[0][1];for(let i=1;i<points.length;i++){const [t,v]=points[i],[lastT,lastV]=points[i-1];if(position<=t)return lastV+(v-lastV)*(position-lastT)/(t-lastT)}return points.at(-1)[1]}
export function scheduleFades(param,now,elapsed,points){param.cancelScheduledValues(now);param.setValueAtTime(envelopeAt(points,elapsed),now);for(const [time,value] of points)if(time>elapsed)param.linearRampToValueAtTime(value,now+time-elapsed)}
export function nextTrackIndex(count,current,{shuffle=false,repeat=false,history=[]}={},random=Math.random){
 if(count<1)return -1;
 if(shuffle){const candidates=Array.from({length:count},(_,i)=>i).filter(i=>i!==current&&!history.includes(i));if(candidates.length)return candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))];if(!repeat)return -1;const others=Array.from({length:count},(_,i)=>i).filter(i=>i!==current);return others.length?others[Math.min(others.length-1,Math.floor(random()*others.length))]:current}
 return current+1<count?current+1:repeat?0:-1;
}

// Keep readable metadata while removing characters forbidden in Windows filenames.
export function videoFilename(artist,title,year,mime='video/mp4'){
 const clean=value=>String(value||'').replace(/[<>:"/\\|?*\x00-\x1f\x7f]/g,' ').replace(/\s+/g,' ').trim().replace(/[. ]+$/g,'');
 const a=clean(artist)||'Artiste inconnu',t=clean(title)||'Sans titre',y=validYear(year);
 const stem=Array.from(`${a} - ${t}`).slice(0,180).join('').replace(/[. ]+$/g,'');
 return `${stem}${y?' ('+y+')':''}.${mime.startsWith('video/mp4')?'mp4':'webm'}`;
}
