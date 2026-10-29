import {validYear} from './year-utils.js';
import {BODIES,automaticBody,nextBody} from './cassette-models.js';
import {loadBodyImages,drawBody,clearCassetteBay,ORIGINAL_FINISHES} from './cassette-bodies.js';
import {frameTransform} from './framing.js';
import {THEMES,appearance,readAppearance,writeAppearance,coverAccent} from './themes.js';
import {readTrackTags} from './metadata.js';
import {createSurfaces,retroCassette,trackSurface} from './surfaces.js';
import {bounds,peaks,rms,time,montageTime} from './audio-utils.js';
const $=id=>document.getElementById(id),canvas=$('canvas'),g=canvas.getContext('2d');
const image=url=>new Promise((resolve,reject)=>{const i=new Image;i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Image illisible'));i.src=url});
const deck=await image('assets/deck.png');
const trackPanel=createSurfaces(deck);
const bodyImages=await loadBodyImages();
for(const [id,m] of Object.entries(BODIES).filter(([id])=>['original','eighties'].includes(id))){const option=document.createElement('option');option.value=id;option.textContent=m.name;$('body').append(option)}
for(const [key,finish] of Object.entries(ORIGINAL_FINISHES)){if(![...$('theme').options].some(o=>o.value===key)){const option=document.createElement('option');option.value=key;option.textContent=finish.name;$('theme').append(option)}}
$('body').value='original';updateBodyControls();
let cover=null,cassette=null,buffer=null,ctx=null,source=null,monitor=null,destination=null,offset=0,started=0,playing=false,exporting=false,recorder=null,stopAt=Infinity,wave=[],url=null,active=-1,loadGeneration=0;
const library=[];
let montageWaveCache=null;
function selection(){if(!buffer)return {start:0,end:0,duration:0,elapsed:0,fraction:0};try{return montageTime(+$('start').value,+$('end').value,buffer.duration,position())}catch{return {start:0,end:0,duration:0,elapsed:0,fraction:0}}}
function selectedWave(range){if(!buffer||!range.duration)return [];if(montageWaveCache?.buffer!==buffer||montageWaveCache.start!==range.start||montageWaveCache.end!==range.end){const data=buffer.getChannelData(0);montageWaveCache={buffer,start:range.start,end:range.end,wave:peaks(data.subarray(Math.floor(range.start*buffer.sampleRate),Math.ceil(range.end*buffer.sampleRate)))}}return montageWaveCache.wave}
function syncSelection(){if(!buffer||exporting)return;const range=selection();halt();offset=range.start;$('seek').min=range.start;$('seek').max=range.end;$('seek').value=offset}

const status=s=>$('status').textContent=s;
function audioContext(){if(!ctx){ctx=new AudioContext();monitor=ctx.createGain();monitor.gain.value=+$('volume').value;monitor.connect(ctx.destination);destination=ctx.createMediaStreamDestination()}return ctx}
function position(){return buffer?Math.min(buffer.duration,offset+(playing?ctx.currentTime-started:0)):0}
function halt(){offset=position();playing=false;if(source){source.onended=null;source.stop();source.disconnect();source=null}$('play').textContent='▶ Écouter'}
async function play(start=offset,end=buffer.duration){halt();await audioContext().resume();offset=start;stopAt=end;source=ctx.createBufferSource();source.buffer=buffer;source.connect(monitor);source.connect(destination);started=ctx.currentTime;playing=true;source.onended=()=>{offset=end;playing=false;source=null;$('play').textContent='▶ Écouter';if(exporting&&recorder?.state==='recording')recorder.stop()};source.start(0,start,end-start);$('play').textContent='Ⅱ Pause'}
function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h)}
function text(value,x,y,size,color='#e8ded0',width=700){g.fillStyle=color;g.font=`${size}px Arial`;g.fillText(value,x,y,width)}
function square(img,x,y,s){const d=Math.min(img.width,img.height);g.drawImage(img,(img.width-d)/2,(img.height-d)/2,d,d,x,y,s,s)}
function meter(x,level,label){const grad=g.createLinearGradient(0,116,0,272);grad.addColorStop(0,'#c68a38');grad.addColorStop(.6,'#ffe19a');grad.addColorStop(1,'#d9a653');rect(x,118,376,152,grad);g.strokeStyle='#362813';g.lineWidth=2;g.beginPath();g.arc(x+188,326,150,Math.PI*1.17,Math.PI*1.83);g.stroke();for(let j=0;j<11;j++){const a=Math.PI*(1.17+j*.066);g.beginPath();g.moveTo(x+188+Math.cos(a)*146,326+Math.sin(a)*146);g.lineTo(x+188+Math.cos(a)*159,326+Math.sin(a)*159);g.stroke()}text('−20   10   5   3   1   0   +3',x+24,163,20,'#382615',330);text('VU',x+157,244,36,'#282018');const a=Math.PI*(1.17+Math.min(1,Math.sqrt(level)*1.5)*.66);g.strokeStyle='#261d17';g.lineWidth=4;g.beginPath();g.moveTo(x+188,273);g.lineTo(x+188+Math.cos(a)*147,273+Math.sin(a)*125);g.stroke()}
function draw(){rect(0,0,1080,1920,'#0b0c0d');g.save();const frame=frameTransform($('framing').value);g.translate(frame.x,frame.y);g.scale(frame.scale,frame.scale);g.drawImage(deck,0,0,941,1672);const range=selection(),clipWave=selectedWave(range),p=position(),sample=buffer?Math.floor(p*buffer.sampleRate):0;meter(65,buffer&&playing?rms(buffer.getChannelData(0),sample):0);meter(497,buffer&&playing?rms(buffer.getChannelData(Math.min(1,buffer.numberOfChannels-1)),sample):0);
if(cassette){clearCassetteBay(g);const s=Math.min(864/cassette.width,557/cassette.height);g.drawImage(cassette,39+(864-cassette.width*s)/2,378+(557-cassette.height*s)/2,cassette.width*s,cassette.height*s)}else if($('body').value!=='studio'){drawBody(g,bodyImages,$('body').value,cover,$('artist').value,$('title').value,range.elapsed,range.duration,$('accent').value,$('theme').value,$('year').value)}else{retroCassette(g,deck,cover,$('artist').value,$('title').value,range.elapsed,range.duration,{theme:$('theme').value,accent:$('accent').value})}
// Replace the complete track display, including all baked-in timing and waveform.
trackSurface(g,deck,trackPanel);g.lineWidth=2;const fraction=range.fraction;for(let j=0;j<240;j++){const height=(clipWave[j]||.015)*40;g.strokeStyle=j/240<=fraction?'#ffb743':'#575650';g.beginPath();g.moveTo(85+j*3.26,1094-height);g.lineTo(85+j*3.26,1094+height);g.stroke()}rect(85+fraction*782,1052,3,87,'#ffbd55');text(time(range.elapsed),84,1164,27,'#ffb743');text(time(range.duration),785,1164,27,'#aaa69e');
// Dynamic transport glyph over the original central control.
const button=g.createRadialGradient(470,1320,5,470,1320,55);button.addColorStop(0,'#28251e');button.addColorStop(1,'#191915');g.fillStyle=button;g.beginPath();g.arc(470,1320,54,0,Math.PI*2);g.fill();text(playing?'Ⅱ':'▶',449,1340,48,'#ffcf7d',60);g.restore();$('seek').value=p;if(exporting)status(`Création de la vidéo… ${Math.min(100,Math.floor((p-offset)/(stopAt-offset)*100))} %`);requestAnimationFrame(draw)}
async function load(entry,index){const generation=++loadGeneration;halt();status('Décodage audio…');$('play').disabled=$('export').disabled=true;try{const blob=entry.file||await (await fetch(entry.path)).blob();
if(!entry.tagsRead){
 const tags=await readTrackTags(blob,entry.file?.name||'LIORA AIOVA — Liora.mp3');
 entry.artist=tags.artist;entry.title=tags.title;entry.year=tags.year;entry.yearOrigin=tags.year?'tag':'';entry.tagWarning=tags.warning;entry.tagsRead=true;
 if(tags.coverBlob&&!entry.cover){const u=URL.createObjectURL(tags.coverBlob);try{entry.cover=await image(u)}catch{}finally{URL.revokeObjectURL(u)}}
}
const raw=await blob.arrayBuffer();
if(!entry.styleKey){const hash=await crypto.subtle.digest('SHA-256',raw);entry.styleKey=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');try{entry.style=readAppearance(localStorage,entry.styleKey)}catch{entry.style=appearance()}}
const decoded=await audioContext().decodeAudioData(raw);if(generation!==loadGeneration)return;buffer=decoded;active=index;offset=0;entry.style=appearance(entry.style);if(!['original','eighties'].includes(entry.style.body)){entry.style.body='original';try{writeAppearance(localStorage,entry.styleKey,entry.style)}catch{}}const style=entry.style;$('body').value=style.body;updateBodyControls();$('theme').value=style.theme;$('accent').value=style.accent;wave=peaks(buffer.getChannelData(0));$('artist').value=entry.artist;$('title').value=entry.title;showYear(entry);cover=entry.cover||null;cassette=entry.cassette||null;$('start').value=0;$('end').value=Math.min(15,buffer.duration).toFixed(2);$('start').max=buffer.duration;$('end').max=Math.ceil(buffer.duration*100)/100;$('fullTrack').disabled=false;syncSelection();$('seek').disabled=false;$('duration').textContent=`Durée : ${time(buffer.duration)} · ${buffer.numberOfChannels} canal/canaux`;$('play').disabled=$('export').disabled=false;list();status(entry.tagWarning||'Tags Artiste et Titre chargés. Piste prête.');if(!entry.year&&!entry.yearSearched)searchYear(entry)}catch(e){if(generation===loadGeneration){buffer=null;status('Import impossible : '+e.message)}}}

function showYear(entry){$('year').value=entry.year||'';$('yearSource').hidden=!entry.yearUrl;if(entry.yearUrl)$('yearSource').href=entry.yearUrl;$('yearNote').textContent=entry.yearOrigin==='tag'?'Année lue dans le tag du fichier.':entry.yearOrigin==='manual'?'Année renseignée manuellement.':entry.yearOrigin==='web'?'Année trouvée sur MusicBrainz (première sortie de l’enregistrement).':entry.yearMessage||'Année inconnue : aucun autocollant affiché.';}
async function searchYear(entry){
 if(!entry||entry.yearOrigin==='tag'||entry.yearOrigin==='manual'){if(entry)$('yearNote').textContent='Année déjà renseignée. Effacez-la pour lancer une recherche.';return}
 if(!entry.artist||!entry.title){$('yearNote').textContent='Renseignez l’artiste et le titre pour rechercher l’année.';return}
 const token=entry.yearToken=(entry.yearToken||0)+1,artist=entry.artist,title=entry.title;entry.yearSearched=true;$('yearNote').textContent='Recherche de l’année sur MusicBrainz…';
 try{const response=await fetch('/api/year?'+new URLSearchParams({artist,title}));if(!response.ok)throw Error();const result=await response.json();
 if(token!==entry.yearToken||artist!==entry.artist||title!==entry.title)return;
 entry.year=validYear(result.year);entry.yearOrigin=entry.year?'web':'';entry.yearUrl=entry.year&&/^https:\/\/musicbrainz\.org\/recording\/[a-f0-9-]+$/.test(result.url||'')?result.url:'';entry.yearMessage=result.reason==='ambiguous'?'Plusieurs années possibles : saisissez l’année après vérification.':'Aucune correspondance certaine trouvée ; vous pouvez saisir l’année.';
 }catch{if(token!==entry.yearToken)return;entry.yearMessage='Recherche indisponible. Vous pouvez saisir l’année ou réessayer.'}
 if(library[active]===entry&&!exporting)showYear(entry);
}
$('year').oninput=()=>{const entry=library[active];if(!entry)return;entry.yearToken=(entry.yearToken||0)+1;entry.year=validYear($('year').value);entry.yearOrigin=entry.year?'manual':'';entry.yearUrl='';entry.yearSearched=false;$('yearSource').hidden=true;$('yearNote').textContent=entry.year?'Année renseignée manuellement.':'Année absente ou invalide : aucun autocollant affiché.';};
$('findYear').onclick=()=>searchYear(library[active]);

function list(){const container=$('library');container.replaceChildren();library.forEach((entry,i)=>{const b=document.createElement('button');b.textContent=`${entry.artist} — ${entry.title}`;b.onclick=()=>{if(!exporting)load(entry,i)};container.append(b)})}
$('example').onclick=async()=>{try{const c=await image('assets/liora.png');let i=library.findIndex(t=>t.path);if(i<0){i=library.push({path:'assets/liora.mp3',artist:'LIORA AIOVA',title:'Liora',cover:c})-1;list()}await load(library[i],i)}catch(e){status(e.message)}};
$('audioFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;const entry={file,artist:'',title:'Lecture des tags…'};library.push(entry);list();await load(entry,library.length-1);e.target.value=''};
for(const [id,key] of [['coverFile','cover'],['cassetteFile','cassette']])$(id).onchange=async e=>{const file=e.target.files[0];if(!file)return;const u=URL.createObjectURL(file);try{const img=await image(u);if(key==='cover')cover=img;else cassette=img;if(library[active])library[active][key]=img}catch(err){status(err.message)}finally{URL.revokeObjectURL(u)}};
for(const key of ['artist','title'])$(key).oninput=()=>{if(library[active]){const entry=library[active];entry[key]=$(key).value;entry.yearToken=(entry.yearToken||0)+1;if(entry.yearOrigin==='web'){entry.year='';entry.yearOrigin='';entry.yearUrl='';entry.yearSearched=false;showYear(entry)}}list()};
function saveStyle(){
 const entry=library[active];cassette=null;
 if(entry){entry.cassette=null;entry.style=appearance({body:$('body').value,theme:$('theme').value,accent:$('accent').value});let saved=false;try{saved=writeAppearance(localStorage,entry.styleKey,entry.style)}catch{}status(saved?'Décoration mémorisée pour cette piste.':'Décoration conservée pour cette session ; stockage local indisponible.')}
}
function updateBodyControls(){const original=['original','eighties'].includes($('body').value);$('theme').disabled=!original&&$('body').value!=='studio';for(const option of $('theme').options)option.textContent=original?ORIGINAL_FINISHES[option.value].name:THEMES[option.value].name;}
$('body').onchange=()=>{updateBodyControls();saveStyle()};
$('anotherBody').onclick=()=>{const keys=Object.keys(ORIGINAL_FINISHES);$('theme').value=keys[(keys.indexOf($('theme').value)+1)%keys.length];saveStyle()};
updateBodyControls();
$('theme').onchange=()=>{$('accent').value=THEMES[$('theme').value].accent;saveStyle()};
$('accent').oninput=saveStyle;
$('defaultAccent').onclick=()=>{$('accent').value=THEMES[$('theme').value].accent;saveStyle()};
$('fromCover').onclick=()=>{if(!cover){status('Chargez une pochette pour en extraire une couleur.');return}const color=coverAccent(cover);if(color){$('accent').value=color;saveStyle()}else status('Aucune couleur dominante suffisamment marquée dans cette pochette.')};
$('resetCassette').onclick=()=>{cassette=null;if(library[active])library[active].cassette=null};
$('volume').oninput=()=>{if(monitor)monitor.gain.value=+$('volume').value};
$('fullTrack').onclick=()=>{if(!buffer||exporting)return;$('start').value='0';$('end').value=(Math.ceil(buffer.duration*100)/100).toFixed(2);syncSelection();status('Montage : chanson entière ('+time(buffer.duration)+').')};
$('end').addEventListener('change',()=>{if(buffer&&Number($('end').value)>buffer.duration){$('end').value=(Math.ceil(buffer.duration*100)/100).toFixed(2);status('Fin ajustée à la durée de la chanson.')}});
for(const id of ['start','end'])$(id).addEventListener('change',syncSelection);
$('play').onclick=()=>{if(playing)halt();else if(buffer){const range=selection();if(!range.duration){status('Choisissez un extrait valide.');return}play(offset<range.start||offset>=range.end?range.start:offset,range.end).catch(e=>status(e.message))}};
$('seek').oninput=async()=>{const p=+$('seek').value,wasPlaying=playing;halt();offset=p;const range=selection();if(wasPlaying&&p<range.end)await play(p,range.end)};
function save(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),60000)}
$('still').onclick=()=>canvas.toBlob(b=>save(b,'snakebond-preview.png'));
function unlock(){exporting=false;if(library[active])showYear(library[active]);$('fields').disabled=false;$('cancel').hidden=true;list()}
$('export').onclick=async()=>{let stream;try{const range=bounds(+$('start').value,+$('end').value,buffer.duration);if(!window.MediaRecorder||!canvas.captureStream)throw Error('Export vidéo non pris en charge dans ce navigateur.');const mime=['video/mp4;codecs=avc1.42001E,mp4a.40.2','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus'].find(m=>MediaRecorder.isTypeSupported(m));if(!mime)throw Error('Aucun encodeur vidéo compatible.');halt();await audioContext().resume();stream=canvas.captureStream(30);for(const track of destination.stream.getAudioTracks())stream.addTrack(track.clone());const chunks=[];let cancelled=false;let cancelMessage="Export annulé.";recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:8000000,audioBitsPerSecond:192000});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onerror=()=>{cancelled=true;cancelMessage='Échec de l’encodage. Aucun export valide.';status(cancelMessage);halt();if(recorder.state!=='inactive')recorder.stop()};recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());unlock();if(cancelled){status(cancelMessage);return;}const blob=new Blob(chunks,{type:recorder.mimeType});if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);$('download').href=url;$('download').download=`snakebond-${$('title').value.replace(/[^\p{L}\p{N}_-]/gu,'_')}.${mime.startsWith('video/mp4')?'mp4':'webm'}`;$('download').hidden=false;status(`Vidéo prête (${(blob.size/1e6).toFixed(1)} Mo). Téléchargez-la ci-dessous.`)};$('cancel').onclick=()=>{cancelled=true;halt();if(recorder.state!=='inactive')recorder.stop();status('Export annulé.')};exporting=true;$('fields').disabled=true;$('cancel').hidden=false;$('download').hidden=true;recorder.start(250);await play(range.start,range.end)}catch(e){halt();if(recorder?.state==='recording')recorder.stop();stream?.getTracks().forEach(t=>t.stop());unlock();status(e.message)}};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&exporting){$('cancel').click();status('Export annulé : gardez cet onglet visible pour préserver la vidéo.')}});
window.addEventListener('beforeunload',e=>{if(exporting){e.preventDefault();e.returnValue=''}});
$('framing').onchange=()=>{$('frameNote').textContent=$('framing').value==='safe'?'Habillage fixe · marges de sécurité invisibles':'Habillage fixe · plein cadre 9:16, sans marges'};
draw();


