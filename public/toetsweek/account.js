(function(){
"use strict";
const STORAGE="axiom-cloud-session-v1",DEVICE="axiom-cloud-device-v1",OWNER="axiom-cloud-owner-v1";
const KEYS=["axiom-v2-progress","axiom-v2-time","axiom-exams-v1","axiom-course-v2","axiom-route-v1","axiom-route-current"];
const shell=document.getElementById("account-shell"),button=document.getElementById("account-button");
if(!shell||!button)return;
let config=null,session=null,ready=false,loading=false,syncBusy=false,queued=false,uploadTimer=null,method="login",status="Lokaal opgeslagen";
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const get=k=>{try{return localStorage.getItem(k)}catch{return null}};
const put=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const remove=k=>{try{localStorage.removeItem(k)}catch{}};
const parse=s=>{try{return JSON.parse(s)}catch{return null}};
let device=get(DEVICE);
if(!device){device=typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():null;if(device)put(DEVICE,device);}
function label(txt){status=txt;button.textContent=session?.user?.email?"Account · "+(txt==="Opgeslagen"?"✓":"●"):"Account";button.title=session?.user?.email?session.user.email+" — "+txt:"Account aanmaken of inloggen";}
function snapshot(){const o={};for(const k of KEYS){const s=get(k);if(s!==null){const parsed=k==="axiom-route-current"?s:parse(s);if(parsed!==null)o[k]=parsed;}}return o;}
function install(o){
 for(const k of KEYS){if(Object.prototype.hasOwnProperty.call(o,k))put(k,k==="axiom-route-current"?o[k]:JSON.stringify(o[k]));else remove(k);}
 window.dispatchEvent(new CustomEvent("axiom:progress-loaded",{detail:{source:"cloud"}}));
}
function meaningful(o){
 const p=o["axiom-v2-progress"];const e=o["axiom-exams-v1"],r=o["axiom-course-v2"],old=o["axiom-route-v1"];
 return !!((p?.attempts?.length||0) || e?.mock || e?.real || (r?.topics&&Object.keys(r.topics).length) || (old?.topics&&Object.keys(old.topics).length));
}
function mergeProgress(a,b){
 const aa=a&&typeof a==="object"?a:{},bb=b&&typeof b==="object"?b:{};
 const raw=[...(Array.isArray(aa.attempts)?aa.attempts:[]),...(Array.isArray(bb.attempts)?bb.attempts:[])];
 const seen=new Map();for(const x of raw){if(x&&typeof x.id==="string"&&typeof x.at==="string"){seen.set(x.id+"|"+x.at, x);}}
 const attempts=[...seen.values()].sort((x,y)=>x.at.localeCompare(y.at)).slice(-700);
 const base=attempts.length>(aa.attempts?.length||0)?bb:aa;
 return {...base,version:2,attempts};
}
function mergeExam(a,b){
 const x=a&&typeof a==="object"?a:{},y=b&&typeof b==="object"?b:{},out={};
 for(const kind of ["mock","real"]){
  const p=x[kind],q=y[kind];
  if(!p){if(q)out[kind]=q;continue;}
  if(!q){out[kind]=p;continue;}
  if(p.start!==q.start){
   out[kind]=p.finished&&(!q.finished || Date.parse(p.finished)>Date.parse(q.finished))?p:
             q.finished&&(!p.finished || Date.parse(q.finished)>=Date.parse(p.finished))?q:
             (Number(p.start)>=Number(q.start)?p:q);
   continue;
  }
  out[kind]={...p,...q,answers:{...(p.answers||{}),...(q.answers||{})},
    marks:{...(p.marks||{}),...(q.marks||{})},flags:{...(p.flags||{}),...(q.flags||{})},
    finished:p.finished||q.finished||null};
 }
 return out;
}
function mergeCourse(a,b){
 const x=a&&typeof a==="object"?a:{},y=b&&typeof b==="object"?b:{};
 const topics={};for(const id of new Set([...Object.keys(x.topics||{}),...Object.keys(y.topics||{})])){
  const p=x.topics?.[id]||{},q=y.topics?.[id]||{};
  const items={...p.practice?.items};
  for(const [i,item] of Object.entries(q.practice?.items||{})){
   let old=items[i]||{};
   items[i]={...old,...item,answer:item.answer||old.answer||"",revealed:!!(old.revealed||item.revealed)};
  }
  const stage=k=>{const l=p[k]||{},r=q[k]||{};return {...l,...r,answer:r.answer||l.answer||"",revealed:!!(l.revealed||r.revealed),done:!!(l.done||r.done)}};
  topics[id]={...p,...q,introDone:!!(p.introDone||q.introDone),
    practice:{...p.practice,...q.practice,index:Math.max(p.practice?.index||0,q.practice?.index||0),done:!!(p.practice?.done||q.practice?.done),items},
    exam:stage("exam"),hard:stage("hard")};
 }
 return {...x,...y,version:2,topics};
}
function mergeSnapshots(a,b){
 const x=a&&typeof a==="object"?a:{},y=b&&typeof b==="object"?b:{},r={...x,...y};
 if(x["axiom-v2-progress"]||y["axiom-v2-progress"])r["axiom-v2-progress"]=mergeProgress(x["axiom-v2-progress"],y["axiom-v2-progress"]);
 if(x["axiom-exams-v1"]||y["axiom-exams-v1"])r["axiom-exams-v1"]=mergeExam(x["axiom-exams-v1"],y["axiom-exams-v1"]);
 if(x["axiom-course-v2"]||y["axiom-course-v2"])r["axiom-course-v2"]=mergeCourse(x["axiom-course-v2"],y["axiom-course-v2"]);
 if(x["axiom-route-v1"]||y["axiom-route-v1"])r["axiom-route-v1"]=mergeCourse(x["axiom-route-v1"],y["axiom-route-v1"]);
 const t=x["axiom-v2-time"],u=y["axiom-v2-time"];
 if(t||u)r["axiom-v2-time"]=!t?u:!u?t:t.date===u.date?{date:t.date,seconds:Math.max(Number(t.seconds)||0,Number(u.seconds)||0)}:t.date>u.date?t:u;
 return r;
}
function saveSession(auth){
 if(!auth?.access_token||!auth?.refresh_token||!auth.user?.id)return false;
 session={access_token:auth.access_token,refresh_token:auth.refresh_token,user:auth.user,
   expires_at:Date.now()+Math.max(90,Number(auth.expires_in)||3600)*1000};
 put(STORAGE,JSON.stringify(session));return true;
}
async function request(path,method="GET",body,auth=false,extra={}){
 if(!config)throw Error("Cloudaccounts zijn nog niet geactiveerd.");
 const headers={"apikey":config.key,"Content-Type":"application/json",...extra};
 if(auth){await ensureToken();headers.Authorization="Bearer "+session.access_token;}
 const response=await fetch(config.url+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:"no-store"});
 const raw=await response.text();let json=parse(raw);if(json===null)json={};
 if(!response.ok){const message=String(json.msg||json.error_description||json.message||json.error||"Onbekende serverfout");
  if(response.status===401)throw Error("Je sessie is verlopen. Log opnieuw in.");
  if(response.status===429)throw Error("Te veel verzoeken. Probeer het later opnieuw.");
  if(response.status===404||message.includes("schema cache"))throw Error("De AXIOM-databasetabel ontbreekt. Rond de cloudconfiguratie af.");
  throw Error(message.slice(0,180));}
 return json;
}
async function ensureToken(){
 if(!session)throw Error("Log opnieuw in.");
 if(session.expires_at>Date.now()+60000)return;
 const old=session;
 const json=await request("/auth/v1/token?grant_type=refresh_token","POST",{refresh_token:session.refresh_token},false);
 if(!saveSession({...json,user:json.user||old.user}))throw Error("Sessie vernieuwen is mislukt.");
}
async function getRows(){
 return await request("/rest/v1/axiom_progress?select=device_id,payload,updated_at","GET",undefined,true);
}
async function upload(o){
 if(!session||!device)return;
 const raw=JSON.stringify(o);
 if(raw.length>480000)throw Error("De voortgang is te groot voor synchronisatie.");
 await request("/rest/v1/axiom_progress?on_conflict=user_id,device_id","POST",
   [{user_id:session.user.id,device_id:device,payload:o,updated_at:new Date().toISOString()}],true,
   {Prefer:"resolution=merge-duplicates,return=minimal"});
}
async function reconcile(first=false){
 if(!session||syncBusy){queued=true;return;}
 syncBusy=true;label("Synchroniseren");
 try{
  const owner=get(OWNER);let local=snapshot();
  if(owner&&owner!==session.user.id){
   put("axiom-cloud-backup-"+owner,JSON.stringify(local));
   local={}; // Never silently transfer a different person's work to this user.
  } else if(first&&!owner&&meaningful(local)){
   const answer=window.confirm("Je hebt al voortgang op dit apparaat. Wil je die één keer aan dit AXIOM-account toevoegen?");
   if(!answer){put("axiom-cloud-anonymous-backup",JSON.stringify(local));local={};}
  }
  const remote=await getRows();if(!Array.isArray(remote))throw Error("Ongeldig antwoord van de opslagserver.");
  let merged=local;
  for(const row of remote){if(row&&row.payload&&typeof row.payload==="object")merged=mergeSnapshots(merged,row.payload);}
  install(merged);
  put(OWNER,session.user.id);
  await upload(merged);
  ready=true;label("Opgeslagen");refreshModal();
 }catch(error){
  label("Niet gesynchroniseerd");ready=true;refreshModal(String(error.message||error));
 }finally{
  syncBusy=false;
  if(queued){queued=false;requestSync();}
 }
}
function requestSync(){
 if(!session||!config)return;
 if(uploadTimer)clearTimeout(uploadTimer);
 uploadTimer=setTimeout(()=>{uploadTimer=null;void reconcile();},1200);
}
async function signIn(email,password){
 const json=await request("/auth/v1/token?grant_type=password","POST",{email,password});
 if(!saveSession(json))throw Error("Inloggen is mislukt.");
 await reconcile(true);
}
async function signUp(email,password){
 const json=await request("/auth/v1/signup","POST",{email,password});
 if(saveSession(json)){await reconcile(true);return "Je account is aangemaakt en je bent ingelogd.";}
 return "Account aangevraagd. Controleer je e-mail om je account te bevestigen en log daarna in.";
}
function signOut(){
 if(!window.confirm("Uitloggen? Je huidige voortgang blijft op dit apparaat en in je cloudaccount bewaard."))return;
 if(uploadTimer){clearTimeout(uploadTimer);uploadTimer=null;}
 // Ensure pending changes are not falsely reported as synced.
 session=null;remove(STORAGE);ready=false;label("Lokaal opgeslagen");refreshModal("Je bent uitgelogd. Je lokale voortgang blijft beschikbaar.");
}
function refreshModal(message=""){
 const email=esc(session?.user?.email||"");
 const configured=!!config;
 shell.innerHTML='<div class="account-overlay" data-account-close></div><section class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">'+
  '<div class="account-header"><h2 id="account-title">Account</h2><button type="button" class="account-close" data-account-close aria-label="Sluiten">×</button></div>'+
  (!configured?'<p>Cloudaccounts zijn nog niet geactiveerd. Je voortgang wordt voorlopig op dit apparaat bewaard.</p><p class="account-help">Voor registratie en synchronisatie moet eerst de beveiligde database worden gekoppeld. De app blijft zonder account werken.</p>':
   session?'<p class="account-user">'+email+'</p><p class="account-help">Voortgang: '+esc(status)+'. Eerdere pogingen en examenresultaten worden in je account bewaard.</p><div class="account-actions"><button class="account-primary" data-account-sync>Nu synchroniseren</button><button class="account-secondary" data-account-logout>Uitloggen</button></div>':
   '<div class="account-tabs"><button type="button" data-account-tab="login" class="'+(method==="login"?"active":"")+'">Inloggen</button><button type="button" data-account-tab="signup" class="'+(method==="signup"?"active":"")+'">Account maken</button></div>'+
   '<form id="account-form"><label for="account-email">E-mailadres</label><input id="account-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="naam@voorbeeld.nl">'+
   '<label for="account-password">Wachtwoord</label><input id="account-password" name="password" type="password" autocomplete="'+(method==="signup"?"new-password":"current-password")+'" minlength="8" required placeholder="Minimaal 8 tekens">'+
   '<button class="account-primary" type="submit">'+(method==="login"?"Inloggen":"Account aanmaken")+'</button></form>'+
   '<p class="account-help">Je bestaande voortgang blijft lokaal bewaard. Bij de eerste aanmelding kun je die aan je account toevoegen.</p>')+
  '<p class="account-message" id="account-message" role="status">'+esc(message)+'</p></section>';
 shell.hidden=false;
 setTimeout(()=>shell.querySelector('[data-account-close]')?.focus(),0);
}
function closeModal(){shell.hidden=true;shell.innerHTML="";button.focus();}
document.addEventListener("click",e=>{
 if(e.target.closest("[data-account-open]")){refreshModal();return;}
 if(shell.hidden)return;
 if(e.target.hasAttribute("data-account-close")||e.target.closest(".account-close")){closeModal();return;}
 const tab=e.target.closest("[data-account-tab]");
 if(tab){method=tab.dataset.accountTab;refreshModal();return;}
 if(e.target.closest("[data-account-logout]")){signOut();return;}
 if(e.target.closest("[data-account-sync]")){void reconcile();return;}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!shell.hidden)closeModal();});
document.addEventListener("submit",async e=>{
 if(e.target.id!=="account-form")return;e.preventDefault();
 const email=String(e.target.elements.email.value).trim().toLowerCase();
 const password=String(e.target.elements.password.value);
 if(password.length<8)return;
 const submit=e.target.querySelector('[type="submit"]'),message=shell.querySelector("#account-message");
 submit.disabled=true;submit.textContent="Moment...";
 try{
  const msg=method==="signup"?await signUp(email,password):(await signIn(email,password),"Ingelogd.");
  if(session)refreshModal(msg);else{method="login";refreshModal(msg);}
 }catch(err){if(message)message.textContent=String(err.message||err);submit.disabled=false;submit.textContent=method==="login"?"Inloggen":"Account aanmaken";}
});
async function init(){
 label("Lokaal opgeslagen");
 try{
  let cfg=window.AXIOM_CLOUD_CONFIG;
  if(!cfg){const res=await fetch("/api/axiom-config",{cache:"no-store"});cfg=res.ok?await res.json():null;}
  if(!cfg?.enabled||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cfg.url)||!cfg.key){config=null;return;}
  config={url:cfg.url.replace(/\/$/,""),key:cfg.key};
  const existing=parse(get(STORAGE));
  if(existing?.refresh_token&&existing?.user?.id){session=existing;await reconcile(true);}
 }catch(err){config=null;label("Lokaal opgeslagen");}
}
window.AxiomAccount={requestSync,snapshot,mergeSnapshots,isConfigured:()=>!!config,isSignedIn:()=>!!session,refresh:()=>reconcile()};
window.addEventListener("online",()=>{if(session)requestSync();});
window.addEventListener("visibilitychange",()=>{if(!document.hidden&&session&&ready)requestSync();});
void init();
})();
