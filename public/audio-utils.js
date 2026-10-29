export function bounds(start,end,duration){if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||end>duration+.02)throw Error('Choisissez un extrait valide, compris dans la durée de la piste.');return {start,end:Math.min(end,duration)}}
export function peaks(data,count=240){const out=[];for(let i=0;i<count;i++){let peak=0;const a=Math.floor(i*data.length/count),b=Math.floor((i+1)*data.length/count);for(let j=a;j<b;j++)peak=Math.max(peak,Math.abs(data[j]));out.push(peak)}return out}
export function rms(data,offset,size=1024){let sum=0,n=0;for(let i=Math.max(0,offset);i<Math.min(data.length,offset+size);i++){sum+=data[i]**2;n++}return n?Math.sqrt(sum/n):0}
export const time=s=>`${Math.floor(Math.max(0,s)/60)}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`;
