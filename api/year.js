import {lookupYear} from '../year-service.mjs';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.writeHead(405).end(JSON.stringify({year: '', reason: 'method-not-allowed'}));
    return;
  }
  const url = new URL(req.url, 'https://cassette.snakebond.net');
  const artist = url.searchParams.get('artist')?.trim();
  const title = url.searchParams.get('title')?.trim();
  if (!artist || !title || artist.length > 140 || title.length > 180) {
    res.writeHead(400).end(JSON.stringify({year: '', reason: 'invalid-query'}));
    return;
  }
  try {
    const result = await lookupYear(artist, title);
    res.writeHead(200).end(JSON.stringify(result));
  } catch {
    res.writeHead(502).end(JSON.stringify({year: '', reason: 'unavailable'}));
  }
}
