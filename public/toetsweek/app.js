(function() {
"use strict";
var E=window.StudyEngine;
if(!E){document.body.textContent="Leerengine kon niet starten.";return;}
var STORE="axiom-v2-progress";
var DAYSTORE="axiom-v2-time";
var storageOK=true;
var state;
try {state=E.sanitize(JSON.parse(localStorage.getItem(STORE)));}catch(e){state=E.blank();storageOK=false;}
var screen="mission", current=null, chosen=null, draft="",hints=0,feedback=null,reason="",aiReply="",busyAI=false,seenRecently=new Set();
var aiCode="";
try {aiCode=sessionStorage.getItem("axiom-code")||"";}catch(e){}
function dayString(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
var today=dayString(),spent=0;
try {var saved=JSON.parse(localStorage.getItem(DAYSTORE)||"{}");spent=saved.date===today?Math.max(0,Number(saved.seconds)||0):0;}catch(e){}
function persist(){try{localStorage.setItem(STORE,JSON.stringify(state));window.AxiomAccount?.requestSync();}catch(e){storageOK=false;notify("Opslaan mislukt: exporteer je voortgang.");}}
function saveTime(){try{localStorage.setItem(DAYSTORE,JSON.stringify({date:today,seconds:spent}));}catch(e){}}
function timeLabel(){return Math.floor(spent/60)+" / 120 min";}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function notify(s){var el=document.getElementById("toast");el.textContent=s;el.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(function(){el.classList.remove("show")},3500);}
function percent(a,b){return b?Math.round(a/b*100):0}
function getTask(){return current||E.choose(state);}
function setTask(q){current=q;chosen=null;draft="";hints=0;feedback=null;reason="";aiReply="";render();}
function attemptTask(q){state.mode=state.mode==="assessment"?"assessment":state.mode;screen="study";if(!state.sessionStart)state.sessionStart=new Date().toISOString();setTask(q||E.choose(state));}
function daysLeft(){return Math.max(0,Math.ceil((Date.parse("2026-10-16T11:30:00+02:00")-Date.now())/86400000));}
function renderNav(){document.body.classList.toggle("axiom-focus-mode",screen==="study");document.querySelectorAll("[data-nav]").forEach(function(btn){var on=btn.getAttribute("data-nav")===screen||(screen==="study" && btn.getAttribute("data-nav")==="mission");btn.classList.toggle("selected",on);btn.setAttribute("aria-current",on?"page":"false")});var c=document.getElementById("crumb");c.textContent=screen==="mission"?"Overzicht":screen==="study"?"Oefening":screen==="map"?"Onderwerpen":screen==="review"?"Herhalen":"Voortgang";}
function header(kicker,title,description){return '<div class="page-heading"><h1 class="display">'+title+'</h1><p class="intro">'+esc(description)+'</p></div>';}
function renderMission(){
 var report=E.report(state),next=E.choose(state),assess=state.mode==="assessment",finished=assess&&!next;
 var title=finished?"Nulmeting afgerond":assess?"Begin met de nulmeting":"Verder oefenen";
 var text=finished?"Je hebt de eerste acht vragen gedaan. Ga verder met de oefenreeks.":assess?"Acht eerste vragen laten zien waar je extra oefening nodig hebt.":next?"Volgende vraag: "+next.module+" · "+next.unitTitle:"Alle vragen zijn geprobeerd. Je kunt nu fouten herhalen.";
 var button=finished?'<button class="primary-btn" data-action="finish-assessment">Verder met oefenen →</button>':next?'<button class="primary-btn" data-action="start">'+(assess?"Start nulmeting":"Volgende oefenvraag")+' →</button>':'<button class="primary-btn" data-nav="review">Fouten herhalen →</button>';
 var out=header("","Overzicht","M10 §4 en §6 · M11 P1 t/m P6");
 out+='<div class="overview-status"><div><b>'+report.attempts+'</b> gemaakte pogingen</div><div><b>'+report.total+'</b> verschillende oefenvragen</div></div>';
 out+='<section class="overview-main"><div class="overview-meta">'+(next?esc(next.module):"Oefenen")+'</div><h2>'+esc(title)+'</h2><p>'+esc(text)+'</p><div class="overview-actions">'+button+'<a class="secondary-btn" href="/toetsweek/examen.html">Examenopgaven</a></div></section>';
 out+='<div class="section-line"><h2>Onderwerpen</h2><span>Oefenreeksen per hoofdstuk</span></div><div class="overview-subjects">';
 E.chapters.forEach(function(c){var m=E.mastery(state,c);out+='<button class="subject-row" data-action="focus" data-unit="'+esc(c.id)+'"><span class="subject-code">'+esc(c.module)+'</span><span class="subject-name">'+esc(c.title)+'</span><span class="subject-progress">'+m.passed+'/'+m.total+' →</span></button>';});
 out+='</div><div class="overview-tools"><button data-nav="review">Fouten herhalen</button><button data-nav="stats">Voortgang bekijken</button></div>';
 out+='<details class="fineprint"><summary>Over beoordelingen</summary><p>Een numeriek antwoord kan automatisch worden nagekeken. Een open antwoord beoordeel je zelf aan de hand van het model; de voortgang is daarom geen voorspeld cijfer. Je eerdere AXIOM-antwoorden blijven in de browser bewaard.</p></details>';
 return out;
}
function renderStudy(){
 var q=getTask();
 if(!q)return header("","Oefenreeks afgerond","Je kunt verder met je foutvragen of examenopgaven.")+'<div class="button-row"><button class="primary-btn" data-action="finish-assessment">Verder oefenen →</button><button class="secondary-btn" data-nav="review">Herhaal fouten</button></div>';
 var chapter=E.chapters.find(function(c){return c.id===q.unitId}), position=chapter.tasks.findIndex(function(t){return t.id===q.id});
 var isAssess=state.mode==="assessment";
 var body='<button class="crumb-back" data-nav="mission">← Overzicht</button><div class="exercise-shell"><div class="exercise-meta"><span>'+(isAssess?"NULMETING":"OEFENEN")+' / '+esc(q.module)+'</span><span>ACTIEVE TIJD: <span id="study-timer">'+timeLabel()+'</span></span></div>';
 body+='<h1 class="exercise-title">'+esc(chapter.title)+'</h1><p class="exercise-sub">'+esc(chapter.blurb)+'</p>';
 body+='<div class="progress-tiny"><span style="width:'+((position+1)/chapter.tasks.length*100)+'%"></span></div>';
 body+='<section class="problem-box"><div class="problem-type">'+esc(q.tier)+' · '+(q.type==="choice"?"REDENEREN":q.type==="number"?"BEREKENEN":"UITLEGGEN")+'</div><h2>'+esc(q.stem)+'</h2>';
 if(q.type==="choice"){
  body+='<label class="sr-only" for="answer-input">Jouw antwoord en uitleg</label><textarea id="answer-input" class="answer-text" placeholder="Schrijf het antwoord én de chemische reden op. Zonder antwoordopties." '+(feedback?"disabled":"")+'>'+esc(draft)+'</textarea><div class="unit-label">Volledig open vraag. Geen meerkeuzeopties; controleer pas na het inleveren.</div>';
 } else if(q.type==="number"){
  body+='<label class="sr-only" for="answer-input">Jouw berekening of uitkomst</label><input id="answer-input" class="answer-input" autocomplete="off" placeholder="Jouw antwoord, bijv. 0,0050 of 5,0e-3" inputmode="text" type="text" autocapitalize="off" spellcheck="false" value="'+esc(draft)+'" '+(feedback?"disabled":"")+'><div class="numeric-tools"><button type="button" data-action="insert-minus" aria-label="Voeg minteken toe">− negatief</button><button type="button" data-action="insert-exp" aria-label="Voeg maal tien tot de macht toe">×10^</button></div><div class="unit-label">Geef je antwoord in '+esc(q.unit||"de aangegeven eenheid")+'. Gebruik − of e-3 voor machten van tien. Schrijf berekenstappen op papier.</div>';
 } else {
  body+='<label class="sr-only" for="answer-input">Jouw uitleg</label><textarea id="answer-input" class="answer-text" placeholder="Schrijf eerst zelf 2–5 zinnen en gebruik je eigen woorden." '+(feedback?"disabled":"")+'>'+esc(draft)+'</textarea><div class="unit-label">Vergelijk je redenering pas na inleveren met het volledige modelantwoord.</div>';
 }
 if(!feedback){
   if(hints)body+='<div class="hint-box"><strong>HINT '+hints+'/2</strong><div>'+esc(q.hints[hints-1])+'</div></div>';
   body+='<div class="problem-actions"><button class="hint-link" data-action="hint" '+(hints>=2||isAssess?"disabled":"")+'>◇ '+(hints===0?"Geef me een kleine hint":hints===1?"Nog één hint":"Geen hints over")+'</button><button class="primary-btn" data-action="submit">'+(q.type==="explain"?"Vergelijk met criteria":"Controleer mijn antwoord")+' →</button></div>';
 }else{
   body+=renderFeedback(q);
 }
 body+='</div>';
 return body;
}
function renderFeedback(q){
 var isExplain=q.type==="explain"||q.type==="choice",out='<div class="feedback '+(feedback.correct===false?"bad":"")+'">';
 if(isExplain&&!feedback.graded){
  out+='<h3>Controleer jouw uitleg met het model.</h3><p>Dit is zelfcorrectie: vergelijk inhoud én de chemische reden; markeer alleen wat letterlijk in je antwoord staat.</p><div class="answer-reference"><strong>VERWACHT ANTWOORD</strong><div>'+esc(q.type==="choice"?q.options[q.answer]:q.answer)+'</div><p>'+esc(q.why)+'</p><div style="border-top:1px solid #3a5564;margin-top:10px;padding-top:12px"><strong>JOUW ANTWOORD</strong><div>'+esc(feedback.submittedAnswer||draft)+'</div></div></div><div class="rubric">';
  var rubric=q.type==="choice"?["Mijn eigen antwoord komt inhoudelijk overeen met het model.","Mijn uitleg bevat de juiste chemische reden."]:q.rubric;
  rubric.forEach(function(r,i){out+='<label><input type="checkbox" data-rubric="'+i+'"> '+esc(r)+'</label>'});
  out+='</div><div class="review-actions"><button class="secondary-btn" data-action="self-incomplete">Ik mis nog iets</button><button class="primary-btn" data-action="self-correct">Alle criteria aanwezig →</button></div>';
 }else{
  var valid=feedback.correct&&feedback.independent;
  out+='<h3>'+(valid?"Zelfstandig opgelost.":feedback.correct?"Goed antwoord, maar met hulp.":"Hier zit een leerkans.")+'</h3>';
  if(feedback.precisionIssue)out+='<p><strong>Significantie:</strong> de waarde klopt numeriek, maar het aantal decimalen of significante cijfers niet. Schrijf het antwoord opnieuw op met de juiste nauwkeurigheid.</p>';
  out+='<p>'+esc(q.why)+'</p>';
  out+='<div class="answer-reference"><strong>Modelantwoord</strong><div>'+esc(q.displayAnswer|| (q.type==="choice"?q.options[q.answer]+" — "+q.why:q.answer))+'</div></div>';
  if(!valid)out+='<p><strong>Belangrijk:</strong> dit onderdeel telt pas mee na een nieuwe zelfstandige poging. Schrijf voor jezelf op welke stap ontbrak.</p>';
  out+='<div class="review-actions"><button class="secondary-btn" data-action="retry">Bekijk deze stap opnieuw</button><button class="primary-btn" data-action="next">Verder volgens leerlijn →</button></div>';
 }
 out+='</div>';
 out+='<section class="ai-block"><strong>AI-coach · optioneel</strong><p>Een aanvullende tutor kan feedback geven op jouw redenering. Standaard blijft alles lokaal; alleen wanneer je zelf op AI-feedback klikt, wordt je antwoord doorgestuurd via de beveiligde serverroute (mits geconfigureerd). Je kunt ook kosteloos een prompt kopiëren.</p>';
 out+='<label class="mini" for="access-code">Toegangscode voor de optionele AI-server (indien ingesteld)</label><input id="access-code" type="password" autocomplete="off" value="'+esc(aiCode)+'" placeholder="Alleen nodig voor ingebouwde AI-feedback"><div class="button-row"><button class="secondary-btn" data-action="ai" '+(busyAI?"disabled":"")+'>'+(busyAI?"Bezig met beoordelen…":"Vraag AI-feedback")+'</button><button class="ghost-btn" data-action="copy-ai">Kopieer coachvraag naar ChatGPT ↗</button></div>';
 if(aiReply)out+='<div class="ai-output">'+esc(aiReply)+'</div>';
 out+='</section>';
 return out;
}
function renderMap(){
 var out=header("Onderwerpen","Onderwerpen","Oefeningen uit de verschillende onderdelen van de toetsstof.");
 out+='<div class="notice">Boekafbakening uit je planning: M10 practicum 4 en 6, M11 practicum 1–6. Voor M11 P6 is §6.5 uitgesloten; §6.1–6.2 zijn in het overzicht leesstof. Check afwijkingen met de docent.</div>';
 out+='<div class="map-list">';
 E.chapters.forEach(function(c,i){var m=E.mastery(state,c);out+='<button class="map-card" data-action="focus" data-unit="'+esc(c.id)+'"><span class="map-num">'+String(i+1).padStart(2,"0")+'</span><span><span class="map-book">'+esc(c.module)+' · '+esc(c.source)+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.blurb)+'</p></span><span class="map-pct">'+m.passed+'/'+m.total+' →</span></button>'});
 out+='</div><p class="footnote">Een module handmatig kiezen mag, maar de coach blijft de vragen binnen die module in volgorde aanbieden. Gebruik de nulmeting om eerst prioriteiten vast te stellen.</p>';
 return out;
}
function renderReview(){
 var report=E.report(state),bad=E.allTasks.filter(function(q){var h=E.history(state,q.id);return h.length&&!E.independentPass(state,q.id)}),out=header("Herhalen","Herhalen","Vragen die nog niet zelfstandig goed gingen.");
 out+='<div class="stats-grid"><div class="stat"><span>Openstaande vragen</span><b>'+bad.length+'</b><small>Ook hints tellen mee</small></div><div class="stat"><span>Nu herhaalbaar</span><b>'+report.reviews+'</b><small>Na tijd tussen de pogingen</small></div><div class="stat"><span>Totale pogingen</span><b>'+report.attempts+'</b><small>Niet gelijk aan beheersing</small></div></div>';
 out+='<div class="section-line"><h2>Herhaalwachtrij</h2><span>Onopgeloste vragen</span></div><div class="list-rows">';
 if(!bad.length)out+='<div class="panel">Je hebt nog geen openstaande fouten. Maak eerst de nulmeting of de leerroute.</div>';
 bad.forEach(function(q){var h=E.history(state,q.id),last=h[h.length-1];out+='<div class="review-row"><span><strong>'+esc(q.module)+" · "+esc(q.unitTitle)+'</strong><small>'+esc(q.tier)+' · '+(last.independent?"Vorige poging fout":"Met hulp of onjuist")+'</small></span><button class="mini-button" data-action="review-item" data-id="'+q.id+'">Herhaal →</button></div>'});
 out+='</div><p class="footnote">Een direct herhaalde identieke vraag is geen sterk bewijs: geef jezelf tijd, leg het antwoord uit en maak een nieuwe toepassingsvraag. De coach gebruikt daarom ook transferopgaven.</p>';
 return out;
}
function renderStats(){
 var r=E.report(state);var out=header("Voortgang","Voortgang","Resultaten van je oefenvragen. Open antwoorden zijn door jouzelf nagekeken.");
 out+='<div class="stats-grid"><div class="stat"><span>Zelfstandig goed</span><b>'+r.passed+'/'+r.total+'</b><small>Oefenitems in deze coach</small></div><div class="stat"><span>Pogingen</span><b>'+r.attempts+'</b><small>Inclusief herstel</small></div><div class="stat"><span>Vandaag actief</span><b id="time-used">'+timeLabel()+'</b><small>Dagbudget 120 min</small></div></div>';
 out+='<div class="section-line"><h2>Per kennisketen</h2><span>Zelfstandig opgelost</span></div><div class="list-rows">';
 r.weak.forEach(function(c){out+='<div class="panel"><div class="panel-heading"><h3>'+esc(c.module)+' · '+esc(c.title)+'</h3><strong>'+c.passed+' / '+c.total+'</strong></div><div class="barline"><span style="width:'+c.percent+'%"></span></div><p class="note">'+c.mistakes+' pogingen met fout of hulpgebruik · '+c.attempts+' totaal</p></div>'});
 out+='</div><div class="section-line"><h2>Gegevens beheren</h2></div><div class="panel"><p class="note">Alle antwoorden en voortgang worden in deze browser bewaard. Gebruik een export om ze op een ander apparaat terug te zetten. Je AI-toegangscode wordt niet in de export opgenomen.</p><div class="button-row"><button class="secondary-btn" data-action="export">Exporteer JSON</button><button class="secondary-btn" data-action="import">Importeer JSON</button><button class="ghost-btn" data-action="reset">Wis lokale coachvoortgang</button></div><input id="import-file" type="file" accept=".json,application/json" style="display:none" aria-label="Importeer voortgang"></div>';
 return out;
}
function render(){
 renderNav();var root=document.getElementById("view");
 root.innerHTML=screen==="mission"?renderMission():screen==="study"?renderStudy():screen==="map"?renderMap():screen==="review"?renderReview():renderStats();
}
function track(correct,independent){
 if(!current)return;
 var now=new Date().toISOString();
 state.attempts.push({id:current.id,at:now,correct:!!correct,independent:!!independent,hints:hints,minutes:Math.max(1,Math.min(12,Math.ceil(spent/60)||3)),selfAssessed:current.type==="explain"||current.type==="choice"});
 state.attempts=state.attempts.slice(-700);
 persist();
}
function handleSubmit(){
 var q=getTask();if(!q||feedback)return;
 var input=document.getElementById("answer-input");
 draft=input?input.value.trim():draft;
 if(!draft){notify("Schrijf eerst een eigen antwoord.");return;}
 if(q.type==="choice"&&draft.length<12){notify("Leg ook de reden achter je antwoord uit.");return;}
 var result=q.type==="choice"?{automatic:false,correct:null}:E.evaluate(q,draft);
 if(!result.automatic){feedback={graded:false,correct:null,independent:false,submittedAnswer:draft};render();return;}
 var independent=hints===0&&!seenRecently.has(q.id);
 feedback={graded:true,correct:result.correct,independent:independent&&result.correct,precisionIssue:!!result.precisionIssue,submittedAnswer:draft};
 seenRecently.add(q.id);track(result.correct,independent&&result.correct);render();
}
function gradeSelf(ok){
 if(!feedback||feedback.graded)return;
 if(ok){var checks=document.querySelectorAll("[data-rubric]");if(Array.from(checks).some(function(x){return !x.checked})){notify("Beoordeel eerst alle drie criteria.");return;}}
 var independent=hints===0&&!seenRecently.has(current.id);
 feedback={graded:true,correct:ok,independent:ok&&independent,submittedAnswer:draft};seenRecently.add(current.id);track(ok,ok&&independent);render();
}
function next(){
 if(state.mode==="assessment"&&!E.choose(state)){state.mode="coach";persist();notify("Nulmeting afgerond. De leerroute begint.");}
 current=null;chosen=null;draft="";hints=0;feedback=null;aiReply="";reason="";
 var nextQuestion=E.choose(state);
 if(!nextQuestion){screen="mission";render();return;}
 current=nextQuestion;screen="study";render();window.scrollTo({top:0,behavior:"smooth"});
}
function aiPrompt(){
 var q=current;if(!q)return "";
 return "Je bent mijn VWO-6 scheikundetutor. Geef geen complimenten en wijs exact aan welke denkstap ontbreekt. Controleer inhoud én significantie. Werk volgens een Socratische microstap. Vak: "+q.module+" / "+q.unitTitle+"\nVraag: "+q.stem+"\nMijn antwoord: "+(draft||"Nog geen antwoord")+"\nModel/rubric: "+q.answer+"\nMijn hints gebruikt: "+hints+"\nGeef in maximaal 120 woorden gerichte feedback en één volgende vraag. Als mijn antwoord ontbreekt, geef dan alleen een hint.";
}
async function copyAI(){
 var value=aiPrompt();if(!value){notify("Open eerst een vraag.");return;}
 try{await navigator.clipboard.writeText(value);notify("Coachvraag gekopieerd. Plak hem in ChatGPT.");}catch(e){window.prompt("Kopieer deze coachvraag:",value);}
}
async function requestAI(){
 var code=document.getElementById("access-code");if(code){aiCode=code.value.trim();try{sessionStorage.setItem("axiom-code",aiCode);}catch(e){}}
 if(!aiCode){notify("Stel een server-toegangscode in, of kopieer de prompt naar ChatGPT.");return;}
 if(!draft.trim()){notify("Schrijf eerst zelf een antwoord.");return;}
 busyAI=true;aiReply="AI-feedback wordt opgehaald…";render();
 try {
  var result=await fetch("/api/coach-feedback",{method:"POST",headers:{"Content-Type":"application/json","X-Coach-Code":aiCode},body:JSON.stringify({question:current.stem,answer:draft,model:String(current.answer),rubric:current.rubric||[],module:current.module})});
  var json=await result.json().catch(function(){return {}});
  if(!result.ok)throw Error(json.error||"AI-server niet beschikbaar. Gebruik de kopieerfunctie.");
  aiReply=String(json.feedback||"Geen feedback ontvangen.").slice(0,3000);
 }catch(e){aiReply=String(e.message||e)+" Je kunt de coachvraag ook handmatig naar ChatGPT sturen.";}
 busyAI=false;render();
}
function download(){
 var payload=JSON.stringify({app:"AXIOM",version:2,progress:state,exportedAt:new Date().toISOString()},null,2);
 var blob=new Blob([payload],{type:"application/json"});
 var url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="axiom-voortgang-"+dayString()+".json";document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url)},5000);notify("Voortgang geëxporteerd.");
}
document.addEventListener("click",function(event){
 var btn=event.target.closest("[data-action], [data-nav]");if(!btn)return;
 if(btn.dataset.nav){screen=btn.dataset.nav;current=null;feedback=null;render();window.scrollTo(0,0);return;}
 var action=btn.dataset.action;
 if(action==="start"){screen="study";if(!state.sessionStart)state.sessionStart=new Date().toISOString();setTask(E.choose(state));return;}
 if(action==="finish-assessment"){state.mode="coach";state.focus=null;persist();screen="mission";render();return;}
 if(action==="choice"){chosen=Number(btn.dataset.value);render();return;}
 if(action==="hint"){if(state.mode==="assessment"){notify("Tijdens de nulmeting geen hints.");return;}hints=Math.min(2,hints+1);render();return;}
 if(action==="insert-minus"||action==="insert-exp"){var input=document.getElementById("answer-input");if(!input||input.disabled)return;var added=action==="insert-minus"?"−":"×10^";var pos=input.selectionStart==null?input.value.length:input.selectionStart;var end=input.selectionEnd==null?pos:input.selectionEnd;input.value=input.value.slice(0,pos)+added+input.value.slice(end);draft=input.value;input.focus();input.setSelectionRange(pos+added.length,pos+added.length);return;}
 if(action==="submit"){handleSubmit();return;}
 if(action==="self-correct"){gradeSelf(true);return;}
 if(action==="self-incomplete"){gradeSelf(false);return;}
 if(action==="next"){next();return;}
 if(action==="retry"){seenRecently.add(current.id);hints=0;chosen=null;draft="";feedback=null;render();return;}
 if(action==="focus"){state.mode="coach";state.focus=btn.dataset.unit;persist();attemptTask(E.choose(state));return;}
 if(action==="review-item"){state.mode="review";state.focus=null;persist();attemptTask(E.byId[btn.dataset.id]);return;}
 if(action==="exam"){state.mode="exam";state.focus=null;persist();attemptTask(E.choose(state));return;}
 if(action==="copy-ai"){copyAI();return;}
 if(action==="ai"){requestAI();return;}
 if(action==="export"){download();return;}
 if(action==="import"){document.getElementById("import-file")?.click();return;}
 if(action==="reset"){if(window.confirm("Alle lokale AXIOM-voortgang wissen? Exporteer eerst als je die wilt bewaren.")){state=E.blank();spent=0;saveTime();persist();screen="mission";seenRecently.clear();render();}return;}
});
document.addEventListener("input",function(event){if(event.target.id==="answer-input")draft=event.target.value;});
document.addEventListener("change",function(event){
 if(event.target.id!=="import-file")return;
 var file=event.target.files?.[0];if(!file)return;
 file.text().then(function(raw){var data=JSON.parse(raw);if(data.app!=="AXIOM"||data.version!==2||!data.progress||!Array.isArray(data.progress.attempts))throw Error("Ongeldig AXIOM-backupbestand");state=E.sanitize(data.progress);persist();current=null;screen="stats";render();notify("Voortgang hersteld.");}).catch(function(e){notify("Import mislukt: "+e.message);});
});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&screen==="study"&&!feedback&&current?.type==="number"){handleSubmit();}});
document.addEventListener("visibilitychange",saveTime);
window.addEventListener("pagehide",saveTime);
window.addEventListener("axiom:progress-loaded",function(){
 try{state=E.sanitize(JSON.parse(localStorage.getItem(STORE)));}catch(e){return;}
 if(screen!=="study"){render();}
});
setInterval(function(){if(dayString()!==today){today=dayString();spent=0;saveTime()}if(screen==="study"&&document.visibilityState==="visible"){spent++;if(spent%10===0)saveTime();var timer=document.getElementById("study-timer");if(timer)timer.textContent=timeLabel();if(spent===7200)notify("Twee uur actieve studietijd bereikt. Neem rust of rond bewust af.");}},1000);
render();
})();