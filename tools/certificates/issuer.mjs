#!/usr/bin/env node
import {webcrypto as crypto, randomBytes} from 'node:crypto';
import {readFile,writeFile,appendFile,mkdir,chmod} from 'node:fs/promises';
import {homedir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const subtle=crypto.subtle, enc=new TextEncoder(), dec=new TextDecoder();
const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const keydir=process.env.STEM2_CERT_KEY_DIR||join(homedir(),'.local','share','stem2connect-verifier');
const keyfile=join(keydir,'issuer-private.jwk');
const journal=join(keydir,'issued.jsonl');
const b64=b=>Buffer.from(b).toString('base64url');
const un64=s=>Buffer.from(s,'base64url');
const hash=async b=>Buffer.from(await subtle.digest('SHA-256',b)).toString('hex');
const argumentsMap=()=>{const a={};for(let i=3;i<process.argv.length;i+=2){if(!process.argv[i].startsWith('--')||!process.argv[i+1])throw Error('Use --name value --event value --date YYYY-MM-DD');a[process.argv[i].slice(2)]=process.argv[i+1]}return a};
async function aesKey(raw,usage){const seed=Buffer.concat([Buffer.from('STEM2CONNECT-CERT-V1:'),raw]);return subtle.importKey('raw',await subtle.digest('SHA-256',seed),'AES-GCM',false,usage)}
async function readPrivate(){return subtle.importKey('jwk',JSON.parse(await readFile(keyfile,'utf8')),{name:'ECDSA',namedCurve:'P-256'},false,['sign'])}
async function saveRecord(id,data){
 if(!/^S2C1-[A-Za-z0-9_-]{22}$/.test(id))throw Error('Invalid ID');const raw=un64(id.slice(5));if(raw.length!==16)throw Error('Invalid ID');const digest=await hash(raw),iv=randomBytes(12);
 const ciphertext=await subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(digest)},await aesKey(raw,['encrypt']),enc.encode(JSON.stringify(data)));
 const rec={version:1,digest,iv:b64(iv),ciphertext:b64(ciphertext)};const signed=enc.encode(`S2C1|${rec.digest}|${rec.iv}|${rec.ciphertext}`);
 rec.signature=b64(await subtle.sign({name:'ECDSA',hash:'SHA-256'},await readPrivate(),signed));
 const pub=await subtle.importKey('jwk',JSON.parse(await readFile(join(root,'verify','public-key.json'),'utf8')),{name:'ECDSA',namedCurve:'P-256'},false,['verify']);if(!await subtle.verify({name:'ECDSA',hash:'SHA-256'},pub,un64(rec.signature),signed))throw Error('Private key does not match the website public key');
 const path=join(root,'verify','records',digest+'.json');await writeFile(path,JSON.stringify(rec)+'\n',{flag:'wx'});return path;
}
async function init(){
 await mkdir(keydir,{recursive:true,mode:0o700});await chmod(keydir,0o700);
 const kp=await subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);const priv=await subtle.exportKey('jwk',kp.privateKey),pub=await subtle.exportKey('jwk',kp.publicKey);
 // Exclusive create prevents replacing a real signing identity by accident.
 await writeFile(keyfile,JSON.stringify(priv)+'\n',{mode:0o600,flag:'wx'});await writeFile(join(root,'verify','public-key.json'),JSON.stringify(pub)+'\n',{flag:'wx'});
 console.log('Issuer initialized. Private key is stored outside the website repository. Back it up securely; do not publish it.');
}
async function issue(){const a=argumentsMap();for(const x of ['name','event','date'])if(!a[x]||a[x].length>200)throw Error('Required: --name, --event, --date (maximum 200 characters each)');if(!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||Number.isNaN(Date.parse(a.date+'T00:00:00Z'))||new Date(a.date+'T00:00:00Z').toISOString().slice(0,10)!==a.date)throw Error('Date must be a valid YYYY-MM-DD');const id='S2C1-'+b64(randomBytes(16));await saveRecord(id,{name:a.name,event:a.event,issued:a.date,status:'valid'});await appendFile(journal,JSON.stringify({id,name:a.name,event:a.event,issued:a.date})+'\n',{mode:0o600});console.log(`Verification ID: ${id}\nPublish the new encrypted record to make it verifiable.`)}
async function changeRecord(action){const a=argumentsMap(),id=a.id;if(!id||!/^S2C1-[A-Za-z0-9_-]{22}$/.test(id))throw Error('Required: --id valid verification ID');const raw=un64(id.slice(5)),digest=await hash(raw),path=join(root,'verify','records',digest+'.json');const rec=JSON.parse(await readFile(path,'utf8'));
 const pub=await subtle.importKey('jwk',JSON.parse(await readFile(join(root,'verify','public-key.json'),'utf8')),{name:'ECDSA',namedCurve:'P-256'},false,['verify']);if(rec.version!==1||rec.digest!==digest||!await subtle.verify({name:'ECDSA',hash:'SHA-256'},pub,un64(rec.signature),enc.encode(`S2C1|${rec.digest}|${rec.iv}|${rec.ciphertext}`)))throw Error('Existing record signature is invalid');
 const data=JSON.parse(dec.decode(await subtle.decrypt({name:'AES-GCM',iv:un64(rec.iv),additionalData:enc.encode(digest)},await aesKey(raw,['decrypt']),un64(rec.ciphertext))));if(action==='revoke')data.status='revoked';else {if(!a.file)throw Error('Required: --file original PNG');const png=await readFile(resolve(a.file));if(png.length>20*1024*1024||!png.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))throw Error('File must be a PNG no larger than 20 MB');data.document_sha256=await hash(png)};const iv=randomBytes(12),ciphertext=await subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(digest)},await aesKey(raw,['encrypt']),enc.encode(JSON.stringify(data)));const updated={version:1,digest,iv:b64(iv),ciphertext:b64(ciphertext)};updated.signature=b64(await subtle.sign({name:'ECDSA',hash:'SHA-256'},await readPrivate(),enc.encode(`S2C1|${updated.digest}|${updated.iv}|${updated.ciphertext}`)));if(!await subtle.verify({name:'ECDSA',hash:'SHA-256'},pub,un64(updated.signature),enc.encode(`S2C1|${updated.digest}|${updated.iv}|${updated.ciphertext}`)))throw Error('Private key does not match website public key');await writeFile(path,JSON.stringify(updated)+'\n');console.log(action==='revoke'?'Marked revoked locally. Publish the change for it to take effect.':'Bound original PNG fingerprint locally. Publish the change for it to take effect.');}
try{if(process.argv[2]==='init')await init();else if(process.argv[2]==='issue')await issue();else if(process.argv[2]==='revoke')await changeRecord('revoke');else if(process.argv[2]==='bind')await changeRecord('bind');else console.log('Usage: node tools/certificates/issuer.mjs init | issue --name "Name" --event "Event" --date YYYY-MM-DD | revoke --id ID | bind --id ID --file original.png')}catch(e){console.error('Error:',e.message);process.exitCode=1}
