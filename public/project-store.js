// Browser-only storage: audio and images never leave this device.
let database;
function openDatabase(){if(!database)database=new Promise((resolve,reject)=>{const request=indexedDB.open('snakebond-projects',1);request.onupgradeneeded=()=>request.result.createObjectStore('projects',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>{database=null;reject(request.error)};request.onblocked=()=>{database=null;reject(Error('Fermez les autres onglets du studio pour ouvrir la sauvegarde.'))}});return database}
async function transaction(mode,action){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('projects',mode),request=action(tx.objectStore('projects'));tx.oncomplete=()=>resolve(request.result);tx.onerror=()=>reject(tx.error||request.error);tx.onabort=()=>reject(tx.error||Error('Sauvegarde interrompue.'))})}
export const putProject=record=>transaction('readwrite',store=>store.put(record));
export const getProject=id=>transaction('readonly',store=>store.get(id));
export const allProjects=()=>transaction('readonly',store=>store.getAll());
export const deleteProject=id=>transaction('readwrite',store=>store.delete(id));
