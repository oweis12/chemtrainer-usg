(function(){
"use strict";
const E=window.StudyEngine,B=window.AXIOM_EXAMS,D=window.AXIOM_ROUTE_DATA,L=window.AXIOM_LESSONS;
const root=document.getElementById("route-content"),selector=document.getElementById("route-units");
if(!E||!B||!D||!L||!root||!selector){if(root)root.textContent="De oefeningen konden niet worden geladen. Probeer de pagina te verversen.";return;}
const STORE="axiom-course-v2",CURRENT="axiom-route-current";
const units=E.chapters.filter(c=>L[c.id]&&D.topics[c.id]);
const hard=Object.fromEntries(D.hard.map(q=>[q.id,q]));
const mocks=Object.fromEntries(units.map(c=>[c.id,B.MOCK.find(q=>q.unit===c.module)||null]));
function blankTopic(){return {introDone:false,practice:{index:0,items:{},done:false},exam:{answer:"",revealed:false,done:false},hard:{answer:"",revealed:false,done:false}};}
let progress={version:2,topics:{}};
try{
 const stored=JSON.parse(localStorage.getItem(STORE)||"null");
 if(stored?.version===2 && stored.topics && typeof stored.topics==="object")progress=stored;
}catch(e){}
const param=new URLSearchParams(location.search).get("module");
let unit=units.some(c=>c.id===param)?param:null;
if(!unit){try{const old=localStorage.getItem(CURRENT);if(units.some(c=>c.id===old))unit=old;}catch(e){}}
if(!unit)unit=units[0].id;
let notice="";
function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function save(){try{localStorage.setItem(STORE,JSON.stringify(progress));window.AxiomAccount?.requestSync();}catch(e){notice="Opslaan is mislukt. Controleer je browseropslag."}}
function data(){
 let d=progress.topics[unit];
 if(!d||typeof d!=="object"){d=blankTopic();progress.topics[unit]=d;}
 if(!d.practice||!d.practice.items)d.practice=blankTopic().practice;
 if(!d.exam)d.exam=blankTopic().exam;
 if(!d.hard)d.hard=blankTopic().hard;
 if(typeof d.introDone!=="boolean")d.introDone=false;
 return d;
}
function activeStage(d){
 if(!d.introDone)return "intro";
 if(!d.practice.done)return "practice";
 if(!d.exam.done)return "exam";
 if(!d.hard.done)return "hard";
 return "finished";
}
function stages(d){return [d.introDone,d.practice.done,d.exam.done,d.hard.done];}
function modelFor(q){
 if(q.type==="choice")return q.options[q.answer]+(q.why?"\n\nUitleg: "+q.why:"");
 if(q.type==="number")return (q.displayAnswer||String(q.answer))+(q.unit&&q.unit!=="pH"&&q.unit!=="pOH"?" "+q.unit:"")+(q.why?"\n\nUitwerking: "+q.why:"");
 return (q.answer||"")+(q.why?"\n\n"+q.why:"");
}
function textArea(label,value,disabled){
 return '<label class="course-label" for="answer-field">'+esc(label)+'</label><textarea id="answer-field" class="r-textarea course-answer" spellcheck="false" '+(disabled?"readonly":"")+' placeholder="Typ hier je uitwerking, of maak de berekening op papier.">'+esc(value||"")+'</textarea>';
}
function stageHeader(d){
 const names=["Uitleg","Oefenen","Toetsvraag","Verdieping"];
 return '<div class="r-steps" aria-label="Leerroutevoortgang">'+names.map((name,i)=>{
  let done=stages(d)[i],current=activeStage(d)===["intro","practice","exam","hard"][i];
  return '<div class="r-step '+(done?"done":current?"active":"")+'"><b>'+(done?"✓":i+1)+'</b><span>'+name+'</span></div>';
 }).join("")+'</div>';
}
function theory(c,d){
 const l=L[c.id];
 let html='<section class="r-card course-lesson"><div class="course-overline">Theorie · '+esc(c.module)+'</div><h2>'+esc(c.title)+'</h2>';
 l.sections.forEach((s,i)=>{
  html+='<div class="course-section"><h3>'+esc(s.heading)+'</h3><p>'+esc(s.text)+'</p><div class="course-example"><span>Voorbeeld</span><p>'+esc(s.example)+'</p></div></div>';
 });
 html+='<div class="course-caution"><strong>Let op</strong><p>'+esc(l.pitfall)+'</p></div>';
 html+='<div class="course-recap"><strong>Na deze uitleg kun je:</strong><ul>'+l.summary.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>';
 html+='<div class="course-actions"><button class="r-button" data-action="intro-done">Start de oefenvragen →</button></div>';
 html+='</section>';
 return html;
}
function practice(c,d){
 const list=c.tasks;
 const i=Math.min(Math.max(0,Number(d.practice.index)||0),list.length-1);
 d.practice.index=i;
 const q=list[i],item=d.practice.items[q.id]||{answer:"",revealed:false};
 const steps=["basis","methode","toepassing","transfer"];
 let html='<section class="r-card course-practice"><div class="course-overline">Oefenvraag '+(i+1)+' van '+list.length+' · '+esc(steps[i]||q.tier)+'</div><h2>'+esc(c.title)+'</h2>';
 html+='<div class="course-question">'+esc(q.stem)+'</div>';
 html+=textArea("Jouw antwoord",item.answer,item.revealed);
 if(!item.revealed){
  html+='<p class="course-footnote">Schrijf eerst zelf een antwoord. De uitwerking verschijnt pas wanneer je hem opvraagt.</p>';
  html+='<div class="course-actions"><button class="r-button" data-action="reveal-practice">Bekijk de uitwerking</button></div>';
 }else{
  html+='<div class="course-model" role="region" aria-label="Modelantwoord"><span>Modelantwoord en uitwerking</span><div>'+esc(modelFor(q))+'</div></div>';
  html+='<div class="course-actions"><button class="r-secondary" data-action="retry-practice">Zelf opnieuw proberen</button><button class="r-button" data-action="practice-next">'+(i===list.length-1?"Naar toetsvraag →":"Volgende oefenvraag →")+'</button></div>';
 }
 if(i>0)html+='<div class="course-backline"><button data-action="practice-prev">← Vorige vraag</button></div>';
 html+='</section>';
 return html;
}
function extendedQuestion(c,d,kind){
 const q=kind==="exam"?mocks[c.id]:hard[c.id],x=d[kind];
 if(!q)return '<div class="r-card"><h2>Vraag niet beschikbaar</h2><p>Gebruik voorlopig de oefenvragen.</p><button class="r-secondary" data-action="back-to-practice">Naar oefeningen</button></div>';
 let html='<section class="r-card course-test"><div class="course-overline">'+(kind==="exam"?"Toetsvraag":"Verdieping")+' · '+esc(c.module)+'</div><h2>'+esc(kind==="exam"?(q.topic||"Toetsvraag"):"Moeilijke toepassingsvraag")+'</h2>';
 html+='<div class="course-context">'+esc(q.context)+'</div>';
 html+='<div class="course-question">'+esc(q.question||q.ask)+'</div>';
 html+=textArea("Jouw uitwerking",x.answer,x.revealed);
 if(!x.revealed){
  html+='<p class="course-footnote">Er worden geen hints of antwoorden getoond vóórdat je de uitwerking opent.</p>';
  html+='<div class="course-actions"><button class="r-button" data-action="reveal-extended">Bekijk het modelantwoord</button></div>';
 } else {
  html+='<div class="course-model" role="region" aria-label="Modelantwoord"><span>Modelantwoord en uitwerking</span><div>'+esc(q.answer||q.model||"").replace(/\*([^*]+)\*/g,"$1")+'</div></div>';
  html+='<div class="course-checkpoints"><strong>In de uitwerking moeten deze stappen zitten:</strong><ul>'+(q.marks||q.rubric||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>';
  html+='<p class="course-footnote">AXIOM geeft geen automatische punten voor open antwoorden. Vergelijk je aanpak met de uitwerking; het vastleggen van deze stap betekent alleen dat je hem hebt doorlopen.</p>';
  html+='<div class="course-actions"><button class="r-secondary" data-action="retry-extended">Zelf opnieuw proberen</button><button class="r-button" data-action="extended-next">'+(kind==="exam"?"Naar de moeilijke vraag →":"Onderwerp afronden →")+'</button></div>';
 }
 html+='</section>';
 return html;
}
function finish(c){
 const next=units.find(x=>!stages(progress.topics[x.id]||blankTopic()).every(Boolean));
 let html='<section class="r-card course-finished"><h2>'+esc(c.module)+' afgerond</h2><p>Je hebt de theorie, vier oefenvragen en twee toetsvragen doorlopen. Je kunt de uitwerkingen opnieuw bekijken, maar doorlopen betekent niet automatisch dat je de stof beheerst.</p><div class="course-actions">';
 if(next&&next.id!==c.id)html+='<button class="r-button" data-action="next-module" data-unit="'+next.id+'">Volgend onderwerp: '+esc(next.module)+' →</button>';
 html+='<a class="r-secondary" href="/toetsweek/examen.html">Proeftoets</a><button class="r-secondary" data-action="repeat-module">Onderwerp opnieuw oefenen</button></div></section>';
 return html;
}
function render(){
 const c=units.find(x=>x.id===unit),d=data(),stage=activeStage(d);
 selector.innerHTML='<label for="route-subject">Onderwerp</label><select id="route-subject" aria-label="Onderwerp kiezen">'+units.map(x=>'<option value="'+x.id+'" '+(x.id===unit?"selected":"")+'>'+esc(x.module)+' · '+esc(x.title)+'</option>').join("")+'</select>';
 let html=stageHeader(d)+'<div class="course-progress"><strong>'+esc(c.module)+'</strong> <span>'+stages(d).filter(Boolean).length+'/4 onderdelen doorlopen</span></div>';
 html+=stage==="intro"?theory(c,d):stage==="practice"?practice(c,d):stage==="exam"?extendedQuestion(c,d,"exam"):stage==="hard"?extendedQuestion(c,d,"hard"):finish(c);
 html+='<p id="route-message" class="r-notice" role="status">'+esc(notice)+'</p>';
 root.innerHTML=html;
}
function setUnit(id){
 if(!units.some(c=>c.id===id))return;
 saveInput();unit=id;notice="";
 try{localStorage.setItem(CURRENT,id)}catch(e){}
 window.history.replaceState(null,"","?module="+encodeURIComponent(id));
 render();
}
function saveInput(){
 const el=document.getElementById("answer-field");if(!el)return;
 const d=data(),stage=activeStage(d),value=el.value.slice(0,16000);
 if(stage==="practice"){
  const q=units.find(c=>c.id===unit).tasks[d.practice.index];
  if(!d.practice.items[q.id])d.practice.items[q.id]={answer:"",revealed:false};
  if(!d.practice.items[q.id].revealed)d.practice.items[q.id].answer=value;
 }else if(stage==="exam"||stage==="hard"){
  if(!d[stage].revealed)d[stage].answer=value;
 }
 save();
}
function action(name,button){
 saveInput();
 const d=data(),stage=activeStage(d),c=units.find(x=>x.id===unit);
 if(name==="intro-done"&&stage==="intro"){d.introDone=true;save();render();return;}
 if(name==="reveal-practice"&&stage==="practice"){const q=c.tasks[d.practice.index];if(!d.practice.items[q.id])d.practice.items[q.id]={answer:"",revealed:false};d.practice.items[q.id].revealed=true;save();render();return;}
 if(name==="practice-next"&&stage==="practice"){
  const q=c.tasks[d.practice.index];
  if(!d.practice.items[q.id]?.revealed){notice="Bekijk eerst de uitwerking.";render();return;}
  if(d.practice.index===c.tasks.length-1){d.practice.done=true;}else{d.practice.index++;}
  save();render();window.scrollTo(0,0);return;
 }
 if(name==="practice-prev"&&stage==="practice"&&d.practice.index>0){d.practice.index--;save();render();return;}
 if(name==="retry-practice"&&stage==="practice"){
  const q=c.tasks[d.practice.index];d.practice.items[q.id]={answer:"",revealed:false};save();render();return;
 }
 if(name==="reveal-extended"&&(stage==="exam"||stage==="hard")){d[stage].revealed=true;save();render();return;}
 if(name==="retry-extended"&&(stage==="exam"||stage==="hard")){d[stage].revealed=false;d[stage].answer="";save();render();return;}
 if(name==="extended-next"&&(stage==="exam"||stage==="hard")&&d[stage].revealed){d[stage].done=true;save();render();window.scrollTo(0,0);return;}
 if(name==="back-to-practice"){d.practice.done=false;save();render();return;}
 if(name==="next-module"){setUnit(button?.dataset?.unit);return;}
 if(name==="repeat-module"){
  if(!window.confirm("De voortgang van alleen dit onderwerp opnieuw starten?"))return;
  progress.topics[unit]=blankTopic();save();render();return;
 }
}
document.addEventListener("input",e=>{if(e.target.id==="answer-field")saveInput();});
document.addEventListener("change",e=>{if(e.target.id==="route-subject")setUnit(e.target.value);});
document.addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(b)action(b.dataset.action,b);});
window.addEventListener("pagehide",saveInput);
window.addEventListener("axiom:progress-loaded",function(){
 try{const imported=JSON.parse(localStorage.getItem(STORE)||"null");if(imported?.version===2&&imported.topics)progress=imported;}catch(e){}
 if(!document.activeElement||document.activeElement.id!=="answer-field")render();
});
render();
})();