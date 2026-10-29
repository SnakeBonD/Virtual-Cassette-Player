import http from 'node:http';
import {lookupYear} from './year-service.mjs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./public/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg'};
http.createServer(async(req,res)=>{try{const requestUrl=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(requestUrl.pathname);if(pathname==='/api/year'){if(req.method!=='GET'){res.writeHead(405).end();return}const artist=requestUrl.searchParams.get('artist')?.trim(),title=requestUrl.searchParams.get('title')?.trim();if(!artist||!title||artist.length>140||title.length>180){res.writeHead(400).end('Artiste et titre requis');return}try{const result=await lookupYear(artist,title);res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(result))}catch{res.writeHead(502,{'Content-Type':'application/json'}).end(JSON.stringify({year:'',reason:'unavailable'}))}return}const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root)){res.writeHead(403).end();return}const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data)}catch{res.writeHead(404).end('Introuvable')}}).listen(4173,'127.0.0.1',()=>console.log('SnakeBonD : http://127.0.0.1:4173'));
