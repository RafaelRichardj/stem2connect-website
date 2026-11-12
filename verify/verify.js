const form=document.querySelector('#verify-form'), field=document.querySelector('#certificate-id'), result=document.querySelector('#result'), button=form.querySelector('button');
const enc=new TextEncoder();
function decode(s){if(!/^[A-Za-z0-9_-]+$/.test(s)) throw Error('encoding');const v=s.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(v+'='.repeat((4-v.length%4)%4)),c=>c.charCodeAt(0));}
function hex(a){return Array.from(new Uint8Array(a),b=>b.toString(16).padStart(2,'0')).join('');}
function display(title, rows, error=false){result.replaceChildren();result.className=error?'error':'';const h=document.createElement('h3');h.textContent=title;result.append(h);if(rows){const dl=document.createElement('dl');for(const [label,value] of rows){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;dl.append(dt,dd)}result.append(dl)}result.hidden=false;}
async function verify(id){
 if(!/^S2C1-[A-Za-z0-9_-]{22}$/.test(id)) return display('Check the ID and try again.',[['Tip','Copy the complete ID from the certificate.']],true);
 try{
  const raw=decode(id.slice(5)); if(raw.length!==16 || btoa(String.fromCharCode(...raw)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')!==id.slice(5)) throw Error('invalid');
  const digest=hex(await crypto.subtle.digest('SHA-256',raw));
  const [keyRes,recRes]=await Promise.all([fetch('/verify/public-key.json',{cache:'no-cache'}),fetch(`/verify/records/${digest}.json`,{cache:'no-cache'})]);
  if(recRes.status===404) return display('No matching certificate found.',[['What to do','Check the ID, or contact STEM2Connect if you need help.']],true);
  if(!keyRes.ok||!recRes.ok) throw Error('network');
  const keyData=await keyRes.json(),rec=await recRes.json();
  if(rec.version!==1||rec.digest!==digest||typeof rec.iv!=='string'||typeof rec.ciphertext!=='string'||typeof rec.signature!=='string') throw Error('invalid');
  const key=await crypto.subtle.importKey('jwk',keyData,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
  const signed=enc.encode(`S2C1|${rec.digest}|${rec.iv}|${rec.ciphertext}`);
  if(!await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,decode(rec.signature),signed)) throw Error('invalid');
  const material=new Uint8Array(enc.encode('STEM2CONNECT-CERT-V1:').length+raw.length);material.set(enc.encode('STEM2CONNECT-CERT-V1:'));material.set(raw,enc.encode('STEM2CONNECT-CERT-V1:').length);
  const aes=await crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',material),'AES-GCM',false,['decrypt']);
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(rec.iv),additionalData:enc.encode(digest)},aes,decode(rec.ciphertext));
  const data=JSON.parse(new TextDecoder().decode(plain));
  if(data.status!=='valid'&&data.status!=='revoked') throw Error('invalid');
  if(![data.name,data.event,data.issued].every(x=>typeof x==='string'&&x.length>0&&x.length<=200)) throw Error('invalid');
  const rows=[['Status',data.status==='valid'?'Valid':'Revoked'],['Recipient',data.name],['Certificate',data.event],['Issue date',data.issued]];
  const selected=document.querySelector('#certificate-file')?.files?.[0];
  if(selected){if(selected.size>20*1024*1024) throw Error('file_too_large'); if(typeof data.document_sha256!=='string') rows.push(['Document file','No original file fingerprint recorded']); else rows.push(['Document file',(hex(await crypto.subtle.digest('SHA-256',await selected.arrayBuffer()))===data.document_sha256)?'Exact match to original':'Does not match original']);}
  display(data.status==='valid'?'✓  Certificate record verified':'Certificate revoked',rows,data.status==='revoked');
  const note=document.createElement('p');note.className='result-note';note.textContent='Compare these details with the document. A valid record does not prove the holder’s identity. Only an exact file match verifies that the selected file is the original issued PNG.';result.append(note);
 }catch(e){display('We couldn’t verify this certificate.',[['What to do','Try again or contact STEM2Connect. The record may be unavailable or invalid.']],true)}
}
form.addEventListener('submit',async e=>{e.preventDefault();button.disabled=true;result.hidden=true;await verify(field.value.trim());button.disabled=false;});
