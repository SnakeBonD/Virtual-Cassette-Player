import {build} from 'esbuild';
await build({entryPoints:['src/metadata.js'],outfile:'public/metadata.js',bundle:true,format:'esm',platform:'browser',minify:true,legalComments:'linked'});
