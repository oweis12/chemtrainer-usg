(function(){
"use strict";
var D=window.AXIOM_EXAMS, STORE="axiom-exams-v1";
var banks={mock:D.MOCK,real:D.REAL}, durations={mock:4800000,real:1200000};
var sessions={mock:null,real:null},kind="",index=0,page="home",saved;
try{saved=JSON.parse(localStorage.getItem(STORE)||"{}");for(var k of ["mock","real"])if(saved[k]&&saved[k].kind===k&&saved[k].answers)sessions[k]=saved[k]}catch(e){}
function esc(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function save(){try{localStorage.setItem(STORE,JSON.stringify(sessions));window.AxiomAccount?.requestSync();}catch(e){}}
function time(s){return Math.max(0,durations[s.kind]-(Date.now()-s.start))}
function hh(t){return Math.floor(t/60000).toString().padStart(2,"0")+":"+Math.floor(t%60000/1000).toString().padStart(2,"0")}
function total(s){var n=0,m=0;for(var q of banks[s.kind]){var r=q.marks||q.rubric;m+=r.length;for(var j=0;j<r.length;j++)if(s.marks[q.id+":"+j])n++;}return {n:n,m:m}}
function finish(expired){if(!sessions[kind]||sessions[kind].finished)return;sessions[kind].finished=new Date().toISOString();sessions[kind].expired=!!expired;page="results";save();}
function guard(){if(kind&&sessions[kind]&&!sessions[kind].finished&&time(sessions[kind])===0)finish(true)}
function start(k,restart){if(!banks[k])return;if(restart&&!confirm("Deze examensessie wissen en opnieuw beginnen?"))return;kind=k;if(restart||!sessions[k])sessions[k]={kind:k,start:Date.now(),answers:{},marks:{},flags:{},finished:null};index=0;page=sessions[k].finished?"results":"exam";save();show();}
function home(){
var mock=sessions.mock,real=sessions.real;
var out='<div class="page-heading"><h1>Toetsen</h1><p>Maak een proeftoets of oefen met officiële examenvragen. De correctie verschijnt na het inleveren.</p></div>';
out+='<div class="exam-two">';
out+='<article class="exam-feature"><div class="overview-meta">12 vragen · 80 minuten · 40 punten</div><h2>Proeftoets M10 en M11</h2><p>Open vragen over de volledige toetsstof, geschreven in examenstijl.</p><button class="exam-primary" data-act="start" data-kind="mock">'+(mock?(mock.finished?"Correctie bekijken":"Verder met proeftoets"):"Begin proeftoets")+' →</button></article>';
out+='<article class="exam-feature"><div class="overview-meta">3 vragen · 20 minuten · 9 punten</div><h2>Echte examenvragen</h2><p>Vwo 2025, tijdvak 1: vragen 9, 14 en 22. Met het officiële correctievoorschrift.</p><button class="exam-secondary" data-act="start" data-kind="real">'+(real?(real.finished?"Correctie bekijken":"Verder met examenvragen"):"Begin examenvragen")+' →</button></article></div>';
out+='<details class="fineprint"><summary>Bronnen en beoordeling</summary><p>De proeftoets is door AXIOM geschreven, niet door je docent of het CvTE. De officiële examenvragen staan in het originele bestand. Je kent na inleveren zelf punten toe op basis van de criteria.</p><p><a href="'+D.LINKS.examination+'" rel="noopener noreferrer" target="_blank">Bekijk het officiële examen vwo 2025-I ↗</a></p></details>';
return out;
}
function exam(){
var v=sessions[kind];guard();if(v.finished)return results();
var list=banks[kind],q=list[index],answered=list.filter(x=>(v.answers[x.id]||"").trim()).length;
var h='<div class="eyebrow">'+(kind==="real"?"Officiële examenvragen":"Proeftoets")+'</div>';
h+='<div class="exam-navigation"><span>VRAAG '+(index+1)+' / '+list.length+' · '+answered+' BEANTWOORD</span><span class="exam-timer" id="exam-time">'+hh(time(v))+'</span></div><div class="exam-progress"><i style="width:'+((index+1)/list.length*100)+'%"></i></div>';
h+='<section class="exam-card"><div class="exam-type-label">'+esc(q.unit)+' / '+esc(q.topic||q.title)+' · '+q.points+' PUNTEN</div><h1 class="exam-question">'+(kind==="real"?"Officiële vraag "+q.number:"Opgave "+(index+1))+'</h1>';
h+='<div class="exam-context">'+esc(q.context)+'</div>';
if(kind==="real"){
h+='<p class="note">'+esc(q.description)+'</p><div class="notice">Lees de volledige vraag en figuren in het originele document. De onderstaande tekst is een verwijzing, niet een herdruk van de officiële opgave.</div><div class="exam-button-row"><a class="exam-external" href="'+D.LINKS.examination+'" target="_blank" rel="noopener noreferrer">Open examen-PDF ↗</a>';
if(q.number===14)h+='<a class="exam-external" href="'+D.LINKS.attachment+'" target="_blank" rel="noopener noreferrer">Uitwerkbijlage ↗</a>';
h+='</div><p class="exam-detail">'+esc(q.page)+' · zoek vraag '+q.number+'.</p>';
}else h+='<p class="exam-question">'+esc(q.question)+'</p>';
h+='<label class="exam-section-label" for="exam-response">JOUW VOLLEDIGE UITWERKING</label><textarea id="exam-response" spellcheck="false" placeholder="Zelf redeneren. Reactievergelijkingen, berekening en conclusie uitschrijven.">'+esc(v.answers[q.id]||"")+'</textarea><p class="exam-sublabel">Je uitwerking wordt lokaal opgeslagen; geen antwoorden vóór het einde.</p>';
h+='<div class="exam-input-nav"><button class="exam-secondary" data-act="prev" '+(!index?"disabled":"")+'>← Vorige</button><div class="exam-button-row"><button class="exam-secondary" data-act="flag">'+(v.flags[q.id]?"◆ Gemarkeerd":"◇ Markeer")+'</button><button class="exam-primary" data-act="'+(index===list.length-1?"finish":"next")+'">'+(index===list.length-1?"Toets inleveren":"Volgende →")+'</button></div></div></section>';
h+='<div class="exam-continue"><span class="note">Bij berekeningen mag je ook papier gebruiken. Typ je kernstappen hier zodat je ze later kunt nakijken.</span><button class="ghost-btn" data-act="finish">Eerder inleveren</button></div>';
return h;
}
function results(){
var v=sessions[kind];if(!v)return home();if(!v.finished){page="exam";return exam();}
var score=total(v),list=banks[kind];
var h='<div class="page-heading"><h1>Nakijken</h1><p>Vergelijk je antwoorden met het model en vink verdiende punten aan. Je beoordeelt jezelf; de software kent geen cijfer toe.</p></div>';
h+='<div class="exam-scorecard"><div class="exam-type-label">ZELF TOEGEKENDE PUNTEN</div><div class="exam-score" id="exam-score">'+score.n+' <small>/ '+score.m+' punten</small></div><div class="barline"><span style="width:'+Math.round(100*score.n/score.m)+'%"></span></div></div>';
if(kind==="real")h+='<div class="notice">Het volledige officiële <a class="exam-external" href="'+D.LINKS.correction+'" target="_blank" rel="noopener noreferrer">correctievoorschrift ↗</a> is nu beschikbaar. De korte criteria hieronder vervangen het officiële beoordelingsmodel niet.</div>';
for(var i=0;i<list.length;i++){
var q=list[i],rubric=q.marks||q.rubric,answer=v.answers[q.id]||"";
h+='<section class="exam-review"><div class="exam-navigation"><span>'+esc(q.unit)+' / '+(kind==="real"?"CVTE "+q.number:"OPGAVE "+(i+1))+'</span><span>'+q.points+' PUNTEN</span></div><h3>'+esc(q.topic||q.title)+'</h3><div class="exam-section-label">JOUW ANTWOORD</div><div class="exam-answer'+(!answer.trim()?" empty":"")+'">'+esc(answer.trim()||"(Geen antwoord)")+'</div>';
if(kind==="mock")h+='<div class="exam-section-label">MODELUITWERKING</div><div class="exam-model">'+esc(q.answer)+'</div>';
else h+='<p class="exam-note">'+esc(q.model)+' <a class="exam-external" target="_blank" rel="noopener noreferrer" href="'+D.LINKS.correction+'">Officiële correctie ↗</a></p>';
for(var j=0;j<rubric.length;j++){var key=q.id+":"+j;h+='<label class="exam-point"><input type="checkbox" data-mark="'+esc(key)+'" '+(v.marks[key]?"checked":"")+'> <span><b>+1 punt</b> · '+esc(rubric[j])+'</span></label>'}
h+='</section>';
}
h+='<div class="exam-button-row"><button class="exam-secondary" data-act="home">← Examenlab</button><button class="exam-primary" data-act="restart">Doe deze toets opnieuw</button></div>';
return h;
}
function show(){
var el=document.getElementById("exam-view");if(!el)return;
document.getElementById("where").textContent=page==="home"?"EXAMENLAB":page==="exam"?"OEFENTOETS":"NAKIJKEN";
el.innerHTML=page==="home"?home():page==="exam"?exam():results();tick();
}
function tick(){if(page!=="exam"||!kind)return;var v=sessions[kind];if(!v.finished&&time(v)===0){finish(true);show();return;}var e=document.getElementById("exam-time");if(e)e.textContent=hh(time(v));}
function saveAnswer(){if(page!=="exam")return;var v=sessions[kind],el=document.getElementById("exam-response");if(el&&!v.finished){v.answers[banks[kind][index].id]=el.value.slice(0,15000);save();}}
function deliver(){var v=sessions[kind];saveAnswer();var missing=banks[kind].filter(x=>!(v.answers[x.id]||"").trim()).length;if(!confirm("Toets inleveren? "+missing+" vragen zijn nog leeg. Daarna zijn de antwoorden niet meer te wijzigen."))return;finish(false);show();window.scrollTo(0,0);}
document.addEventListener("click",function(event){
var b=event.target.closest("[data-act],[data-route]");if(!b)return;
var nav=b.dataset.route;if(nav){if(nav==="start"){page="home";kind="";show()}else if(nav==="result"){if(kind&&sessions[kind].finished){page="results";show()}else alert("Lever eerst de toets in.")}return;}
var a=b.dataset.act;if(a==="start"){start(b.dataset.kind,false);return}if(a==="restart"){start(kind,true);return}
if(a==="home"){page="home";kind="";show();return}
if(a==="next"){saveAnswer();index=Math.min(index+1,banks[kind].length-1);show();window.scrollTo(0,0);return}
if(a==="prev"){saveAnswer();index=Math.max(index-1,0);show();window.scrollTo(0,0);return}
if(a==="finish"){deliver();return}
if(a==="flag"){saveAnswer();var v=sessions[kind],id=banks[kind][index].id;v.flags[id]=!v.flags[id];save();show();return}
});
document.addEventListener("input",function(e){if(e.target.id==="exam-response")saveAnswer()});
document.addEventListener("change",function(e){var k=e.target.dataset.mark;if(!k||page!=="results")return;var v=sessions[kind];if(!v.finished)return;v.marks[k]=!!e.target.checked;save();var sc=total(v),a=document.getElementById("exam-score");if(a)a.innerHTML=sc.n+' <small>/ '+sc.m+' punten</small>';var bar=document.querySelector(".exam-scorecard .barline span");if(bar)bar.style.width=Math.round(sc.n/sc.m*100)+"%"});
window.addEventListener("axiom:progress-loaded",function(){
 try{const imported=JSON.parse(localStorage.getItem(STORE)||"{}");for(const k of ["mock","real"]){if(imported[k]&&imported[k].kind===k&&imported[k].answers)sessions[k]=imported[k];}}catch(e){}
 if(page==="home"||page==="results")show();
});
setInterval(tick,1000);show();
})();