const normalize = value => String(value || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const mbid = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
export function coverCandidates(data, artist, title, album = '') {
  const recordings = (data.recordings || []).filter(r => Number(r.score) >= 95 && !r.disambiguation && normalize(r.title) === normalize(title) && normalize((r['artist-credit'] || []).map(a => (a.name || a.artist?.name || '') + (a.joinphrase || '')).join('')) === normalize(artist));
  const identities = new Set(recordings.map(r => (r['artist-credit'] || []).map(a => a.artist?.id || a.name).join('/')));
  if (identities.size > 1) return [];
  const releases = recordings.flatMap(r => r.releases || []).filter(r => mbid.test(r.id) && (album ? normalize(r.title) === normalize(album) : !(r['release-group']?.['secondary-types'] || []).includes('Compilation')));
  return [...new Map(releases.sort((a,b) => (a.date || '9999').localeCompare(b.date || '9999')).map(r => [r.id,r])).values()].slice(0, 2);
}
let queue = Promise.resolve(), lastRequest = 0;
export function musicBrainzRecordings(artist, title, album = '') {
  const run = queue.then(async () => {
    const wait = Math.max(0, 1100 - (Date.now() - lastRequest));
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));
    lastRequest = Date.now();
    const quote = s => '"' + s.replace(/[\\"]/g, ' ').trim() + '"';
    const query = new URLSearchParams({query: 'recording:' + quote(title) + ' AND artist:' + quote(artist) + (album ? ' AND release:' + quote(album) : ''), fmt:'json', limit:'25'});
    const response = await fetch('https://musicbrainz.org/ws/2/recording/?' + query, {headers:{'User-Agent':'SnakeBonDStudio/1.0 (https://cassette.snakebond.net)',Accept:'application/json'}, signal:AbortSignal.timeout(9000)});
    if (!response.ok) throw Error('MusicBrainz indisponible');
    return response.json();
  });
  queue = run.catch(() => {});
  return run;
}
export async function lookupCover(artist, title, album = '', request = fetch, search = musicBrainzRecordings) {
  const candidates = coverCandidates(await search(artist,title,album), artist,title,album);
  const attempts=candidates.map(release=>({release,kind:'release',id:release.id}));
  const groups=new Set();
  for(const release of candidates){const id=release['release-group']?.id;if(mbid.test(id||'')&&!groups.has(id)){groups.add(id);attempts.push({release,kind:'release-group',id});}}
  for (const {release,kind,id} of attempts.slice(0,3)) {
    const response = await request(`https://coverartarchive.org/${kind}/${id}/front-500`, {signal:AbortSignal.timeout(10000)});
    if (response.status === 404) continue;
    if (!response.ok) throw Error('Pochettes indisponibles');
    const type = (response.headers.get('content-type') || '').split(';')[0];
    if (!['image/jpeg','image/png','image/webp'].includes(type)) throw Error('Image invalide');
    const reader = response.body.getReader(), chunks = []; let size = 0;
    while (true) { const {done,value} = await reader.read(); if (done) break; size += value.length; if (size > 3_000_000) { await reader.cancel(); throw Error('Image trop volumineuse'); } chunks.push(value); }
    if (!size) throw Error('Image vide');
    return {image:Buffer.concat(chunks).toString('base64'), type, album:release.title, source:'MusicBrainz / Cover Art Archive', url:'https://musicbrainz.org/' + kind + '/' + id};
  }
  return {reason:'not-found'};
}
