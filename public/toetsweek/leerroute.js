(function(){
"use strict";
var E=window.StudyEngine,B=window.AXIOM_EXAMS,D=window.AXIOM_ROUTE_DATA;
if(!E||!B||!D){document.getElementById("route-content").textContent="Leerroutedata ontbreekt.";return}
const STORE="axiom-route-v1",SHARED="Gedeelde documenten → 2026–2027 / USG Scheikunde klas 6 TUE",MAGISTER="https://nuovo.magister.net/magister/#/elo/bronnen";
const units=E.chapters.filter(c=>D.topics[c.id]);
const allHard=Object.fromEntries(D.hard.map(q=>[q.id,q]));
const bank={};
for(const c of units){bank[c.id]=B.MOCK.find(q=>q.unit===c.module)||null}
let all={version:1,topics:{}},unit="r",draft="",started=Date.now();
try{const loaded=JSON.parse(localStorage.getItem(STORE)||"null");if(loaded&&loaded.version===1&&loaded.topics&&typeof loaded.topics==="object"){all=loaded;}}
catch(e){}
function blank(){return {intro:{opened:false,reflection:"",done:false},book:{index:0,notes:{},done:false},exam:{answer:"",submitted:false,marks:[],done:false,retries:0},hard:{answer:"",submitted:false,marks:[],done:false,retries:0}};}
function data(){if(!all.topics[unit])all.topics[unit]=blank();return all.topics[unit]}
function save(){try{localStorage.setItem(STORE,JSON.stringify(all));}catch(e){toast("Opslaan mislukt. Controleer de browseropslag.")}}
function esc(str){return String(str??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function toast(str){const el=document.getElementById("route-message");if(el)el.textContent=str;}
function getStage(p){return !p.intro.done?"intro":!p.book.done?"book":!p.exam.done?"exam":!p.hard.done?"hard":"finished"}
function status(p){return [p.intro.done,p.book.done,p.exam.done,p.hard.done]}
function choice(){const saved=new URLSearchParams(location.search).get("module")||"";if(units.some(c=>c.id===saved))return saved;try{const last=localStorage.getItem("axiom-route-current");if(units.some(c=>c.id===last))return last;}catch(e){}return "r";}
unit=choice();
const root=document.getElementById("route-content"),nav=document.getElementById("route-units");
function rowPrimary(ref,title){
 if(!ref)return "";
 const path=SHARED+" → "+ref.folder;
 return '<div class="r-ref"><span class="r-label">'+esc(title)+'</span><b>'+esc(ref.file)+'</b><small>'+esc(path)+'</small><a href="'+MAGISTER+'" target="_blank" rel="noopener noreferrer" data-resource="true">Open dit document in Magister ↗</a><p class="r-small">Magister heeft niet voor alle documenten een publieke directe link. Selecteer de map en bestandsnaam hierboven.</p></div>';
}
function renderIntro(c,p,conf){
 const s=p.intro;
 let out='<div class="r-card"><span class="r-label">FASE 01 / BEGRIJPEN VÓÓR OEFENEN</span><h2>Één gerichte uitleg</h2>';
 out+='<p>Begin niet blind aan sommen. Gebruik één bron en schrijf daarna zonder hulp uit wat je begrepen hebt. Deze stap wordt pas voltooid na je eigen korte uitleg.</p>';
 if(conf.video){
  out+='<div class="r-ref r-video"><div><span class="r-label">'+(conf.video.kind==="video"?"UITLEGVIDEO":"UITLEGBRON")+'</span><b>'+esc(conf.video.label)+'</b><small>Gerichte externe bron, geen herdruk van schoolmateriaal</small></div><a href="'+esc(conf.video.url)+'" target="_blank" rel="noopener noreferrer" data-resource="true">Open uitleg ↗</a></div>';
 } else {
  out+='<div class="r-warning">Voor dit specifieke practicum heb ik nog geen gecontroleerde, exact passende video gevonden. Je docentboekje is daarom verplicht als uitlegbron; geen willekeurige video van een ander hoofdstuk.</div>';
 }
 out+=rowPrimary({file:conf.file,folder:conf.folder},"BRON UIT JE EIGEN METHODE");
 out+='<div class="r-good">Voor je verdergaat: '+(s.opened?"✓ Je hebt een bron geopend. Nu je eigen redenering formuleren.":"Open eerst de uitlegbron hierboven. Die wordt extern geopend; het kijkgedrag zelf kan deze app niet verifiëren.")+'</div>';
 out+='<label class="r-label" for="route-input">LEG DIT ZONDER HULP UIT</label><p>'+esc(conf.recall)+'</p>';
 out+='<textarea class="r-textarea" id="route-input" placeholder="Schrijf minimaal enkele zinnen uit je hoofd. Geen opsomming van woorden.">'+esc(s.reflection)+'</textarea>';
 out+='<div class="r-cta"><button class="r-button" data-action="intro-complete" '+(!s.opened?"disabled":"")+'>Ik kan dit zelf uitleggen →</button><button class="r-secondary" data-action="intro-resource">Ik heb de bron daadwerkelijk geopend</button></div>';
 out+='<p class="r-small">Voorwaarde: bron geopend + eigen uitleg van ten minste 60 tekens. Dit controleert niet automatisch of je uitleg chemisch klopt; test dat in de volgende stappen.</p></div>';
 return out;
}
function renderBook(c,p,conf){
 const s=p.book,methods=c.methodSteps||[],idx=Math.min(s.index,methods.length-1),m=methods[idx];
 let out='<div class="r-card"><span class="r-label">FASE 02 / BOEK IN ORIGINELE VOLGORDE</span><h2>Van experiment naar theorie</h2>';
 out+='<p>Dit is geen willekeurige vraaggenerator. Volg de opgaven en conclusies in dezelfde volgorde als in het boekje. Ga niet naar het volgende onderdeel totdat je de huidige keten hebt afgewerkt.</p>';
 out+=rowPrimary({file:conf.file,folder:conf.folder},"VERPLICHTE METHODE");
 out+='<div class="r-progress"><span>Deel '+(idx+1)+' van '+methods.length+'</span><span>'+esc(c.module)+' · '+esc(m.sections)+'</span></div>';
 out+='<div class="r-sequence"><b>§'+esc(m.sections)+' · '+esc(m.goal)+'</b><p>'+esc(m.instruction)+'</p></div>';
 if(conf.aPracticum){out+='<div class="r-silver"><span class="r-label">AANVULLEND DOOR DOCENT GESELECTEERD (2023–24)</span><p>'+esc(conf.aPracticum)+'</p><p class="r-small">Bron: M11 t/m P3 kw1 samengevat en oefenopgaven 6 2023–2024. Bij deze A-practica moet je normaliter eerdere vragen doorlopen; voer geen geïsoleerde opgave willekeurig uit.</p></div>'}
 out+='<label class="r-label" for="route-input">CONTROLE VAN JE EIGEN WERK</label><p>Welke opgave of redeneerstap was het lastigst en hoe heb je die uiteindelijk opgelost? Noem de chemische oorzaak, geen algemene tekst.</p><textarea id="route-input" class="r-textarea" placeholder="Bij vraag … dacht ik … maar ik moest … omdat …">'+esc(s.notes[idx]||"")+'</textarea>';
 out+='<div class="r-cta"><button class="r-button" data-action="book-next">'+(idx===methods.length-1?"Boekketen afronden →":"Volgende paragraaf →")+'</button></div>';
 out+='<details><summary class="r-small">Alleen bij vastlopen: één extra bron</summary>'+rowPrimary({file:conf.extra,folder:conf.extraFolder},"GERICHTE NASLAG")+'</details>';
 out+='</div>';
 return out;
}
function answerBlock(q,s,step){
 const rubric=q.rubric||q.marks||[];
 const reached=!!s.submitted, score=s.marks.filter(Boolean).length,minimum=Math.ceil(rubric.length*0.75);
 let h='<div class="r-card"><span class="r-label">FASE '+(step==="exam"?"03 / OPEN EXAMENVRAAG":"04 / ZWARE TRANSFER")+'</span><h2>'+(step==="exam"?"Pas het toe zonder hints":"Kan je dit in een nieuwe situatie?")+'</h2>';
 h+='<div class="r-silver">'+esc(q.context)+'</div>';
 h+='<p class="exam-question">'+esc(q.question||q.ask)+'</p>';
 h+='<label for="route-input" class="r-label">EIGEN REDENERING, VERGELIJKING EN BEREKENING</label>';
 h+='<textarea id="route-input" class="r-textarea" style="min-height:220px" '+(reached?"disabled":"")+' placeholder="Gebruik eventueel papier voor de berekening, maar zet hier je belangrijkste stappen en conclusie.">'+esc(s.answer||"")+'</textarea>';
 if(!reached){
  h+='<p class="r-small">Geen hints en geen uitwerking tot je antwoord is ingeleverd. Schrijf meerdere stappen zodat je eerlijk kunt nakijken.</p><div class="r-cta"><button class="r-button" data-action="submit-answer">Inleveren en model pas daarna tonen →</button></div>';
 }else{
  h+='<div class="r-answer"><strong>MODELUITWERKING</strong><div style="margin-top:9px">'+esc(q.model||q.answer)+'</div></div>';
  h+='<p>Geef jezelf uitsluitend een punt wanneer die stap duidelijk in je oorspronkelijke uitwerking staat. Deze score wordt door jou toegekend, niet automatisch door AI.</p>';
  h+='<div class="r-marks">';
  rubric.forEach((r,i)=>{h+='<label><input type="checkbox" data-rubric="'+i+'" '+(s.marks[i]?"checked":"")+'><div><span>+1 punt</span> '+esc(r)+'</div></label>'});
  h+='</div><div class="'+(score>=minimum?"r-good":"r-warning")+'">Zelf beoordeeld: '+score+'/'+rubric.length+' punten. Voor deze stap heb je minimaal '+minimum+' punten nodig. '+(s.retries?'Je hebt dit model eerder bekeken; een herhaling is geen onafhankelijk bewijs.':'')+'</div>';
  h+='<div class="r-cta"><button class="r-button" data-action="confirm-score">'+(step==="hard"?"Resultaat vastleggen →":"Verder naar zware transfer →")+'</button><button class="r-secondary" data-action="retry-answer">Herstel en probeer opnieuw</button></div>';
 }
 h+='</div>';return h;
}
function renderFinished(c){
 return '<section class="r-card"><span class="r-label">LEERROUTE AFGEROND</span><h2>'+esc(c.module)+' · Gereed voor een proeftoets</h2><p>Je hebt vier stappen afgerond: uitleg, boekketen, open examenvraag en zware transfer. De open vragen zijn door jouzelf beoordeeld, dus test je begrip nog op een nieuwe vraag die je nooit eerder zag.</p><div class="r-cta"><a class="r-button" href="/toetsweek/examen.html" style="text-decoration:none">Start het volledige Examenlab →</a><button class="r-secondary" data-action="repeat-topic">Onderwerp nog eens leren</button></div></section>';
}
function render(){
 const p=data(),c=units.find(x=>x.id===unit),conf=D.topics[unit];
 nav.innerHTML=units.map(x=>'<button data-unit="'+x.id+'" class="'+(x.id===unit?"active":"")+'">'+esc(x.module)+'</button>').join("");
 const stage=getStage(p),flags=status(p);
 const headings=["Uitleg","Boekvolgorde","Examenvraag","Transfer"];
 let h='<div class="r-steps">'+headings.map((name,i)=>'<div class="r-step '+(flags[i]?"done":stage===["intro","book","exam","hard"][i]?"active":"")+'"><b>'+(flags[i]?"✓":String(i+1).padStart(2,"0"))+'</b>'+name+'</div>').join('')+'</div>';
 h+='<div class="r-progress"><span>'+esc(c.module)+' · '+esc(c.title)+'</span><span>'+flags.filter(Boolean).length+' / 4 fasen</span></div>';
 if(stage==="intro")h+=renderIntro(c,p,conf);
 else if(stage==="book")h+=renderBook(c,p,conf);
 else if(stage==="exam")h+=answerBlock(bank[unit],p.exam,"exam");
 else if(stage==="hard")h+=answerBlock(allHard[unit],p.hard,"hard");
 else h+=renderFinished(c);
 h+='<div class="r-notice" id="route-message" role="status"></div>';root.innerHTML=h;
}
function persistInput(){const text=document.getElementById("route-input");if(!text)return;const p=data(),s=getStage(p);if(s==="intro")p.intro.reflection=text.value.slice(0,6000);if(s==="book")p.book.notes[p.book.index]=text.value.slice(0,6000);if(s==="exam")p.exam.answer=text.value.slice(0,15000);if(s==="hard")p.hard.answer=text.value.slice(0,15000);save()}
function switchUnit(id){if(!units.some(c=>c.id===id))return;persistInput();unit=id;try{localStorage.setItem("axiom-route-current",id)}catch(e){}window.history.replaceState(null,"","?module="+encodeURIComponent(id));render()}
function act(action){
 const p=data(),stage=getStage(p);persistInput();
 if(action==="intro-resource"){p.intro.opened=true;save();render();return}
 if(action==="intro-complete"){if(!p.intro.opened){toast("Open eerst een uitlegbron.");return}if(p.intro.reflection.trim().length<60){toast("Leg dit uitgebreider uit, in minimaal twee zinnen (60 tekens).");return}p.intro.done=true;save();render();return}
 if(action==="book-next"){let i=p.book.index,ref=p.book.notes[i]||"";if(ref.trim().length<40){toast("Beschrijf eerst concreet een lastige denkstap en hoe je die oploste.");return}if(i+1>=units.find(x=>x.id===unit).methodSteps.length)p.book.done=true;else p.book.index++;save();render();return}
 if(action==="submit-answer"){const s=p[stage];if(!["exam","hard"].includes(stage))return;if(s.answer.trim().length<35){toast("Schrijf je redenering met voldoende tussenstappen uit voordat je inlevert.");return}s.submitted=true;save();render();return}
 if(action==="confirm-score"){if(!["exam","hard"].includes(stage))return;const s=p[stage],q=stage==="exam"?bank[unit]:allHard[unit],rubric=q.rubric||q.marks,earned=s.marks.filter(Boolean).length,min=Math.ceil(rubric.length*0.75);
 if(earned<min){toast("Je hebt "+earned+"/"+rubric.length+". Herstel de redeneerstappen en probeer opnieuw.");return}
 s.done=true;save();render();return}
 if(action==="retry-answer"){if(!["exam","hard"].includes(stage))return;const s=p[stage];s.submitted=false;s.answer="";s.marks=[];s.retries++;save();render();return}
 if(action==="repeat-topic"){if(!confirm("Je wilt de leergang voor dit onderwerp opnieuw doen? Je eerdere voortgang van dit onderwerp wordt teruggezet."))return;all.topics[unit]=blank();save();render();return}
}
document.addEventListener("input",e=>{if(e.target.id==="route-input")persistInput()});
document.addEventListener("click",e=>{
 const button=e.target.closest("[data-unit]");if(button){switchUnit(button.dataset.unit);return}
 const link=e.target.closest("[data-resource]");if(link){const p=data();if(getStage(p)==="intro"){p.intro.opened=true;save();}return}
 const action=e.target.closest("[data-action]");if(action)act(action.dataset.action);
});
document.addEventListener("change",e=>{if(!e.target.hasAttribute("data-rubric"))return;const p=data(),stage=getStage(p);if(!["exam","hard"].includes(stage))return;p[stage].marks[Number(e.target.dataset.rubric)]=!!e.target.checked;save();render()});
render();
})();