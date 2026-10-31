'use strict';
const $=s=>document.querySelector(s),V=()=>$('#view');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY='swcamp.v1';
const pad=n=>String(n).padStart(2,'0');
const dk=(d=new Date())=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const addD=(k,n)=>{const d=new Date(k+'T12:00');d.setDate(d.getDate()+n);return dk(d)};
const dayDiff=(a,b)=>Math.round((new Date(b+'T12:00')-new Date(a+'T12:00'))/864e5);
const fmt=k=>new Date(k+'T12:00').toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'short'});
const CAMP_START='2026-12-01',CAMP_END='2026-12-06';
const ARCH=['King','Warrior','Magician','Lover'];
const RITUALS=[
 {id:'layl',name:'Salat al-Layl',note:'Reviving the habit. Any portion counts on a broken-sleep night; build towards the full eleven rak\'ah.'},
 {id:'munajat',name:'Munajat segment of the day',note:'Read today\'s lines in Arabic and English (Learn tab).'},
 {id:'read',name:'Book reading target',note:'King, Warrior, Magician, Lover: today\'s pages.'},
 {id:'train',name:'Training session',note:'Cardio, strength or mobility. The guide says: do not overtrain right before travel.'},
 {id:'quran',name:'Quran',note:''},
 {id:'grat',name:'Gratitude',note:'Three things, written in the journal.'}];
const TASKS=[
 ['ins','Travel insurance: must cover wrestling, boxing, kickboxing and medical evacuation','2026-11-08'],
 ['arsh','Book Arsh Boutique Hotel for nights 30 Nov and 6 Dec (WhatsApp +66 94 762 7999)','2026-11-07'],
 ['reza','Send Reza T-shirt size (chest measure) and roommate preference','2026-11-02'],
 ['pass','Passport valid 6+ months from 30 Nov 2026 (to at least 30 May 2027); keep a copy','2026-11-05'],
 ['visa','Check visa and entry rules for your nationality and route','2026-11-10'],
 ['health','Tell organisers about any health, injury or medication change','2026-11-20'],
 ['tdac','Thailand Digital Arrival Card (within 3 days before arrival) and save confirmation','2026-11-27'],
 ['ci1','Scoot online check-in, outbound','2026-11-27'],
 ['wa','Check WhatsApp group for meeting point, venue pin, transfer info (keep the pin private)','2026-11-28'],
 ['ci2','Scoot online check-in, return','2026-12-05']];
const GEAR=['Boxing/kickboxing gloves','Properly fitted mouthguard','Protective headgear','Hand wraps (recommended)','Prayer mat (sajjadeh)','Turbah','Misbaha (optional)','Warm layer for early mornings and evenings','Swimwear for the pool','TSA lock for checked bag'];
const PACK=['Light, breathable clothes for six days','Several sets of sportswear and trainers','Comfortable sleepwear, underwear and socks','Slippers or flip-flops','Football boots (only if you want them)','Toiletries and deodorant','Prescribed medication in original packaging, in hand luggage, with prescription or letter','Personal first aid, blister pads, usual pain relief','Electrolytes or supplements if you normally use them','Insect repellent and sunscreen','Passport and a digital or paper copy','Travel insurance details','Universal travel adaptor','Small amount of Thai baht','Torch or headlamp (optional)','Snacks or drinks you personally need','Power banks and electronics in hand luggage'];
const LISTEN={rec:[
 ['INbjiuColDE','Munajat Sha\'baniyya','Murtadha Quraysh (official channel, murtada qurish / مرتضى قريش)'],
 ['FYVkqXRl3lk','Dua Kumayl','Murtadha Quraysh (official channel)'],
 ['cCikFsAXwWY','Dua al-Hazeen','Sayed Walid al-Mazidi (وليد المزيدي - Topic)'],
 ['GijTO-giYNg','Dua al-Hazeen, recited after Salat al-Layl','Sayed Walid al-Mazidi (uploaded by Naji Khalaf)'],
 ['m8ogzCNwH9E','Dua Abu Hamza al-Thumali','Murtadha Quraysh (official channel)'],
 ['jRa2rTLFuT8','Munajat al-Ta\'ibin (of the Repentant)','Murtadha Quraysh (Hamlat al-Iman, Qatif)'],
 ['-YSc3KToqaw','Munajat al-Muridin (of the Seekers)','Murtadha Quraysh (Hamlat al-Iman, Qatif)'],
 ['5QVMnAQPg8M','Munajat of Amir al-Mu\'minin in Masjid al-Kufa','Murtadha Quraysh (Hamlat al-Iman, Qatif)'],
 ['p9Qy8O32kzE','Munajat Sha\'baniyya, Shaykh Abdulhai Qambar','Participant Guide p.4 link (Tawassul channel)'],
 ['Un5uHYKSaVg','Imam Khomeini on the Munajat [Eng Sub]','Participant Guide p.4 link (Elhaam Magazine)']],
 music:[
 ['vNwYtllyt3Q','Brian Eno, Music for Airports','Full album'],
 ['c4E6RO4muLU','Stars of the Lid, And Their Refinement of the Decline','Full album'],
 ['fxhEGU_GWd0','Hammock, Oblivion Hymns','"In the Middle of this Nowhere" (official Hammock channel)'],
 ['oAhO5eegMfY','Ólafur Arnalds, re:member','Title track (official)'],
 ['AaZWSxdJSxU','Max Richter, Sleep','Live, official Max Richter channel (8 hrs)'],
 ['hCqsqab2eTg','Gentle rain on forest','3 hours, no music'],
 ['SZ16mn757MA','Windy forest nature sounds','3 hours, no music']]};

let S=load();let D=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
function init(){const d={cfg:{},rit:RITUALS.map(r=>({...r})),log:{},tasks:{},gear:{},pack:{},chap:{},film:false,intent:[],journal:[],reviews:[],arch:[],mStart:'2026-11-01',mPer:5};for(const k in d)if(S[k]===undefined)S[k]=d[k]}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1600)}
// personal details arrive via link hash so they are never in public code
function readHash(){const m=location.hash.match(/cfg=([^&]+)/);if(m){try{Object.assign(S.cfg,JSON.parse(decodeURIComponent(escape(atob(m[1])))));save();history.replaceState(null,'',location.pathname)}catch(e){}}}
function phase(k=dk()){if(k<CAMP_START)return'Before';if(k<=CAMP_END)return'During';return'After'}
function streak(id){let n=0,k=dk();if(!(S.log[k]||{})[id])k=addD(k,-1);while((S.log[k]||{})[id]){n++;k=addD(k,-1)}return n}
function cdown(iso){if(!iso)return null;const ms=new Date(iso)-new Date();if(ms<0)return null;const d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24;return`${d}d ${h}h`}
function md(t){const L=esc(t).split('\n');let o='',ul=false;for(let l of L){l=l.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g,'$1<i>$2</i>');if(/^\s*([-*]|\d+\.)\s/.test(l)){if(!ul){o+='<ul>';ul=true}o+='<li>'+l.replace(/^\s*([-*]|\d+\.)\s/,'')+'</li>';continue}if(ul){o+='</ul>';ul=false}const h=l.match(/^(#{1,3})\s(.*)/);if(h)o+=`<h3>${h[2]}</h3>`;else if(l.trim())o+='<p>'+l+'</p>'}return o+(ul?'</ul>':'')}
function mIdx(k=dk()){const n=Math.max(0,dayDiff(S.mStart,k));return(n*S.mPer)%134}
function segHTML(from,cnt){let o='';for(let i=0;i<cnt;i++){const s=D.munajat[(from+i)%134];o+=`<div class="seg"><div class="mu">${s.n}${s.flag?' · meaning debated, see notes':''}</div><div class="ar">${esc(s.ar)}</div><div class="tr">${esc(s.tr)}</div><div>${esc(s.en)}</div></div>`}return o}
function nextTask(){return TASKS.filter(t=>(S.tasks[t[0]]||'todo')!=='done').sort((a,b)=>a[2]<b[2]?-1:1)[0]}
function yt(id){return'https://www.youtube.com/watch?v='+id}

const TABS=[['home','◎','Home'],['rit','☾','Rituals'],['learn','❖','Learn'],['tasks','✓','Tasks'],['jour','✎','Journal'],['acc','⚖','Review']];
let tab='home',sub={};
function nav(){$('#tabs').innerHTML=TABS.map(t=>`<button class="${t[0]===tab?'on':''}" onclick="go('${t[0]}')"><b>${t[1]}</b>${t[2]}</button>`).join('');$('#phase').textContent=phase()+' camp'}
function go(t){tab=t;nav();R[t]();scrollTo(0,0)}
function ritRows(k){const l=S.log[k]||{};return S.rit.map(r=>`<div class="chk ${l[r.id]?'done':''}" onclick="tick('${k}','${r.id}')"><div class="box ${l[r.id]?'on':''}">${l[r.id]?'✓':''}</div><div class="grow"><div class="t">${esc(r.name)}</div>${r.note?`<div class="mu">${esc(r.note)}</div>`:''}</div><div class="mu">${streak(r.id)}🔥</div></div>`).join('')}
function tick(k,id){S.log[k]=S.log[k]||{};S.log[k][id]=!S.log[k][id];save();R[tab]()}
const R={};
R.home=()=>{const c=S.cfg,k=dk(),f=cdown(c.flightOut),cs=cdown(CAMP_START+'T10:00:00+07:00');const nt=nextTask();const it=S.intent[S.intent.length-1];
V().innerHTML=`<h1>${c.name?'Salam, '+esc(c.name):'Salam'}</h1><div class="mu">${fmt(k)}</div><br>
<div class="cd"><div class="card"><div class="mu">To flight</div><div class="big">${f||(c.flightOut?'Flown':'?')}</div><div class="mu">${c.flightOut?'':'Set in Review > Settings'}</div></div><div class="card"><div class="mu">To camp (1 Dec)</div><div class="big">${cs||(phase()==='During'?'Day '+(dayDiff(CAMP_START,k)+1):'Done')}</div></div></div><br>
${it?`<div class="card"><div class="mu">My intention</div><p class="intent">${esc(it.text)}</p></div>`:`<div class="card"><b>Write your intention.</b><div class="mu">Why am I coming? What do I need to confront or improve? What do I want to take home? (Guide p.4)</div><br><button class="b" onclick="go('acc')">Write it</button></div>`}
<div class="card"><h2>Today's rituals</h2>${ritRows(k)}</div>
${nt?`<div class="card"><div class="mu">Next task · due ${fmt(nt[2])}</div><div>${esc(nt[1])}</div><br><button class="g b" onclick="go('tasks')">Open tasks</button></div>`:''}
<div class="card"><h2>Today's Munajat</h2>${segHTML(mIdx(),Math.min(2,S.mPer))}<button class="g b" onclick="sub.learn='mun';go('learn')">All of today's lines</button></div>
<div class="card"><h2>Phase: ${phase()}</h2><div class="mu">${{Before:'Now to Sun 29 Nov. Read, train, revive the night prayer, sort logistics.',During:'1 to 6 Dec. Be present. Morning intention, evening reflection. Phone mostly away.',After:'From 8 Dec. Integrate. Reviews at 1 week, 1 month and 3 months. Bring it home.'}[phase()]}</div></div>`};
R.rit=()=>{const k=dk();let wk='<div class="week">';for(let i=6;i>=0;i--){const d=addD(k,-i),l=S.log[d]||{},n=S.rit.filter(r=>l[r.id]).length;wk+=`<div>${new Date(d+'T12:00').toLocaleDateString('en-AU',{weekday:'narrow'})}<i style="background:rgba(201,164,92,${.12+.88*n/Math.max(1,S.rit.length)})"></i>${n}</div>`}wk+='</div>';
V().innerHTML=`<h1>Daily rituals</h1><div class="card">${ritRows(k)}</div><div class="card"><h2>Last 7 days</h2>${wk}</div>
<div class="card"><h2>Edit rituals</h2>${S.rit.map((r,i)=>`<div class="row" style="margin:6px 0"><input type="text" value="${esc(r.name)}" onchange="S.rit[${i}].name=this.value;save()"><button class="g b" onclick="S.rit.splice(${i},1);save();R.rit()">✕</button></div>`).join('')}<div class="row"><input id="nr" type="text" placeholder="New ritual"><button class="b" onclick="if($('#nr').value){S.rit.push({id:'r'+Date.now(),name:$('#nr').value,note:''});save();R.rit()}">Add</button></div>
<p class="mu">Salat al-Layl: you already know it. On nights with the baby, a short portion still keeps the thread; the guide's method is eleven rak'ah before Fajr.</p></div>`};
R.learn=()=>{const s=sub.learn||'book';const tabs=[['book','Book'],['film','Film'],['mun','Munajat'],['gl','Glossary'],['listen','Listen']];let h=`<div class="sub">${tabs.map(t=>`<span class="pill ${s===t[0]?'on':''}" onclick="sub.learn='${t[0]}';R.learn()">${t[1]}</span>`).join('')}</div>`;
if(s==='book'){const done=D.chapters.filter(c=>S.chap[c.id]).length;h+=`<h1>King, Warrior, Magician, Lover</h1><div class="mu">${done}/${D.chapters.length} sections read. Notes include summaries, key quotes with pages, practices and a camp link (interpretation).</div><br>`+D.chapters.map(c=>`<div class="card"><div class="row"><div class="box ${S.chap[c.id]?'on':''}" onclick="S.chap['${c.id}']=!S.chap['${c.id}'];save();R.learn()">${S.chap[c.id]?'✓':''}</div><div class="grow"><b>${esc(c.title)}</b></div></div><details><summary>Notes and practices</summary><div class="md">${md(c.md.split('\n').slice(1).join('\n'))}</div><button class="b" onclick="newEntry('Reflection on: ${esc(c.title).replace(/'/g,'')}')">Journal on this</button></details></div>`).join('')}
if(s==='film'){h+=`<h1>King Arthur: Legend of the Sword (2017)</h1><div class="card"><div class="chk ${S.film?'done':''}" onclick="S.film=!S.film;save();R.learn()"><div class="box ${S.film?'on':''}">${S.film?'✓':''}</div><div class="t">Watched</div></div><div class="mu">Notes come from Wikipedia and reviews. The archetype mapping is interpretation, labelled as such.</div></div>`+D.film.map(f=>`<div class="card"><details><summary>${esc(f.split('\n')[0].replace(/^#\s*/,''))}</summary><div class="md">${md(f.split('\n').slice(1).join('\n'))}</div></details></div>`).join('')}
if(s==='mun'){const st=sub.mi??mIdx();h+=`<h1>Munajat Sha'baniyya</h1><div class="mu">Segments ${D.munajat[st].n} to ${D.munajat[(st+S.mPer-1)%134].n} of 134. English is your own translation from the Arabic.</div><div class="row" style="margin:10px 0"><button class="g b" onclick="sub.mi=(${st}-S.mPer+134)%134;R.learn()">‹ Prev</button><button class="g b grow" onclick="sub.mi=undefined;R.learn()">Today</button><button class="g b" onclick="sub.mi=(${st}+S.mPer)%134;R.learn()">Next ›</button></div><div class="card">${segHTML(st,S.mPer)}</div><div class="card"><label class="mu">Lines per day</label><select onchange="S.mPer=+this.value;save();R.learn()">${[3,5,8,10,134].map(n=>`<option ${n===S.mPer?'selected':''}>${n}</option>`).join('')}</select></div><div class="card"><details><summary>Background and themes</summary><div class="md">${md(D.munajatNotes)}</div></details></div>`}
if(s==='gl'){h+=`<h1>Glossary</h1><input type="search" id="gq" placeholder="Search terms, e.g. Tyrant" oninput="gl()"><div id="gr" class="card md" style="margin-top:10px"></div>`}
if(s==='listen'){const L=a=>a.map(x=>`<div class="chk"><div class="grow"><a href="${yt(x[0])}" target="_blank" rel="noopener" style="color:var(--gold2)">${esc(x[1])}</a><div class="mu">${esc(x[2])}</div></div></div>`).join('');h+=`<h1>Listen</h1><div class="card"><h2>Recitations</h2>${L(LISTEN.rec)}</div><div class="card"><h2>Reading background</h2><div class="mu">No lyrics, little change. Opens in YouTube; search the same names on Spotify or Apple Music.</div>${L(LISTEN.music)}</div>`}
V().innerHTML=h;if(s==='gl')gl()};
function gl(){const q=($('#gq')?.value||'').toLowerCase();$('#gr').innerHTML='<ul>'+D.glossary.filter(g=>g.toLowerCase().includes(q)).map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul>'}
R.tasks=()=>{const st=['todo','doing','done'];const row=t=>{const v=S.tasks[t[0]]||'todo';return`<div class="chk"><div class="grow"><div>${esc(t[1])}</div><div class="mu">Due ${fmt(t[2])}</div></div><span class="st ${v}" onclick="S.tasks['${t[0]}']=['todo','doing','done'][(${st.indexOf(v)}+1)%3];save();R.tasks()">${v}</span></div>`};
const ck=(o,list,name)=>list.map((g,i)=>`<div class="chk ${S[o][i]?'done':''}" onclick="S.${o}[${i}]=!S.${o}[${i}];save();R.tasks()"><div class="box ${S[o][i]?'on':''}">${S[o][i]?'✓':''}</div><div class="t">${esc(g)}</div></div>`).join('');
const c=S.cfg;V().innerHTML=`<h1>Logistics</h1><div class="mu">Tap a status to cycle todo, doing, done.</div><div class="card">${TASKS.slice().sort((a,b)=>a[2]<b[2]?-1:1).map(row).join('')}</div>
<div class="card"><h2>Key times</h2><div class="mu">${c.flightOut?`Out: ${esc(c.outText||'')}<br>Home: ${esc(c.homeText||'')}<br>${c.ref?'Booking ref '+esc(c.ref)+'<br>':''}`:''}1 Dec: coaches leave Arsh 10:00am. 6 Dec: coaches return to Arsh about 4:00pm. Taxi alternative about 1h30.<br><a style="color:var(--gold)" href="https://tdac.immigration.go.th/arrival-card" target="_blank">TDAC website</a> · <a style="color:var(--gold)" href="https://wa.me/66947627999" target="_blank">Arsh on WhatsApp</a></div></div>
<div class="card"><h2>Gear</h2>${ck('gear',GEAR)}</div><div class="card"><h2>Packing</h2><div class="mu">Provided at camp: towel, notebook and pen, water bottle. Laundry on site.</div>${ck('pack',PACK)}</div>`};
const PROMPTS={Before:['What did today\'s reading show me about myself?','Which archetype was strongest or weakest in me today?','What am I avoiding that I need to face before camp?'],During:['Morning: how will I live my intention today?','Evening: where did I meet my limits today, and what did I learn?','What did a brother or a sheikh say that I must keep?'],After:['What have I kept from camp this week, and what has slipped?','How did I bring it home to Zainab and Hassan today?','What one habit am I protecting this week?']};
function newEntry(p){S.journal.unshift({id:Date.now(),date:dk(),phase:phase(),prompt:p||PROMPTS[phase()][0],text:'',tags:[],mood:3,energy:3});save();sub.je=S.journal[0].id;go('jour')}
R.jour=()=>{const e=S.journal.find(x=>x.id===sub.je);if(e){V().innerHTML=`<button class="g b" onclick="sub.je=null;R.jour()">‹ Entries</button><h2>${fmt(e.date)} · ${e.phase}</h2><select style="width:100%" onchange="J().prompt=this.value;save()">${[...new Set([e.prompt,...PROMPTS[e.phase]])].map(p=>`<option ${p===e.prompt?'selected':''}>${esc(p)}</option>`).join('')}</select><br><br><textarea style="min-height:220px" oninput="J().text=this.value;save()">${esc(e.text)}</textarea><div>${ARCH.map(a=>`<span class="pill ${e.tags.includes(a)?'on':''}" onclick="tg('${a}')">${a}</span>`).join('')}</div><label class="mu">Mood ${e.mood}/5</label><input type="range" min="1" max="5" value="${e.mood}" onchange="J().mood=+this.value;save();R.jour()"><label class="mu">Energy ${e.energy}/5</label><input type="range" min="1" max="5" value="${e.energy}" onchange="J().energy=+this.value;save();R.jour()"><br><br><button class="g b" onclick="if(confirm('Delete this entry?')){S.journal=S.journal.filter(x=>x.id!==${e.id});sub.je=null;save();R.jour()}">Delete</button>`;return}
const q=(sub.jq||'').toLowerCase(),list=S.journal.filter(x=>!q||(x.text+x.prompt+x.tags.join(' ')).toLowerCase().includes(q));
V().innerHTML=`<h1>Journal</h1><div class="card"><div class="mu">Prompts for the ${phase()} phase</div>${PROMPTS[phase()].map(p=>`<div class="chk" onclick="newEntry(this.dataset.p)" data-p="${esc(p)}"><div class="t">✎ ${esc(p)}</div></div>`).join('')}</div><input type="search" placeholder="Search entries or archetype" value="${esc(sub.jq||'')}" oninput="sub.jq=this.value;R.jour();const i=document.querySelector('input[type=search]');i.focus();i.setSelectionRange(i.value.length,i.value.length)"><br><br>${list.map(x=>`<div class="card" onclick="sub.je=${x.id};R.jour()"><div class="mu">${fmt(x.date)} · ${x.tags.join(', ')||'untagged'} · mood ${x.mood} · energy ${x.energy}</div><b>${esc(x.prompt)}</b><div class="mu">${esc(x.text.slice(0,120))}</div></div>`).join('')||'<div class="mu">No entries yet.</div>'}`};
function J(){return S.journal.find(x=>x.id===sub.je)}
function tg(a){const e=J();e.tags=e.tags.includes(a)?e.tags.filter(t=>t!==a):[...e.tags,a];save();R.jour()}
function weekKey(k=dk()){const d=new Date(k+'T12:00');d.setDate(d.getDate()-((d.getDay()+6)%7));return dk(d)}
function summary(){const k=dk(),wk=weekKey();let done=0,tot=0;for(let i=0;i<7;i++){const l=S.log[addD(wk,i)]||{};S.rit.forEach(r=>{tot++;if(l[r.id])done++})}
const rv=S.reviews.find(r=>r.week===wk)||{},ar=S.arch.find(a=>a.week===wk);const it=S.intent[S.intent.length-1];
return`SW Camp check-in, ${fmt(k)} (${phase()})
Intention: ${it?it.text:'not written yet'}
Rituals this week: ${done}/${tot}. Streaks: ${S.rit.map(r=>r.name+' '+streak(r.id)).join(', ')}
Book: ${D.chapters.filter(c=>S.chap[c.id]).length}/${D.chapters.length} sections. Film watched: ${S.film?'yes':'no'}
Tasks done: ${TASKS.filter(t=>S.tasks[t[0]]==='done').length}/${TASKS.length}. Open: ${TASKS.filter(t=>S.tasks[t[0]]!=='done').map(t=>t[1].split(':')[0].split('(')[0].trim()).slice(0,4).join('; ')}
Archetypes (1-10): ${ar?ARCH.map(a=>a+' '+ar[a]).join(', '):'not scored'}
Wins: ${rv.wins||'-'}
Misses: ${rv.miss||'-'}
Recommit: ${rv.re||'-'}
Journal entries this week: ${S.journal.filter(j=>j.date>=wk).length}`}
R.acc=()=>{const wk=weekKey();let rv=S.reviews.find(r=>r.week===wk);if(!rv){rv={week:wk,wins:'',miss:'',re:''};S.reviews.push(rv)}let ar=S.arch.find(a=>a.week===wk);if(!ar){ar={week:wk,King:5,Warrior:5,Magician:5,Lover:5};S.arch.push(ar)}
const it=S.intent[S.intent.length-1],k=dk(),c=S.cfg;const after=phase()==='After'||sub.showAfter;
const ms=[['1 week','2026-12-15'],['1 month','2027-01-08'],['3 months','2027-03-08']];
V().innerHTML=`<h1>Review</h1>
<div class="card"><h2>Intention</h2><div class="mu">Two or three sentences: Why am I coming? What do I need to confront or improve? What do I want to take home?</div><textarea id="itx">${esc(it?it.text:'')}</textarea><button class="b" onclick="const t=$('#itx').value.trim();if(t){S.intent.push({text:t,date:dk()});save();toast('Saved as version '+S.intent.length);R.acc()}">Save new version</button>${S.intent.length>1?`<details><summary>${S.intent.length} versions</summary>${S.intent.map((v,i)=>`<p class="mu">v${i+1} · ${fmt(v.date)}<br>${esc(v.text)}</p>`).reverse().join('')}</details>`:''}</div>
<div class="card"><h2>Weekly review · week of ${fmt(wk)}</h2>${[['wins','Wins'],['miss','Misses'],['re','Recommit to']].map(f=>`<label class="mu">${f[1]}</label><textarea oninput="S.reviews.find(r=>r.week==='${wk}').${f[0]}=this.value;save()">${esc(rv[f[0]])}</textarea>`).join('')}</div>
<div class="card"><h2>Archetype check (1 to 10)</h2><div class="mu">How mature and present was each energy in me this week?</div>${ARCH.map(a=>`<label>${a}: <b>${ar[a]}</b></label><input type="range" min="1" max="10" value="${ar[a]}" onchange="S.arch.find(x=>x.week==='${wk}')['${a}']=+this.value;save();R.acc()">`).join('')}${S.arch.length>1?`<div class="mu">History: ${S.arch.map(x=>fmt(x.week)+' '+ARCH.map(a=>a[0]+x[a]).join(' ')).join(' | ')}</div>`:''}</div>
<div class="card"><h2>Share with SW Camp</h2><div class="mu">Copies a summary so you can paste it to your SW Camp bot in chat.</div><br><button class="b" onclick="share()">Copy summary</button></div>
<div class="card"><h2>After camp</h2>${after?'':'<div class="mu">Unlocks from 8 Dec. </div><button class="g b" onclick="sub.showAfter=1;R.acc()">Preview</button>'}${after?`<div class="mu">Reviews</div>${ms.map(m=>`<div class="chk"><div class="grow">${m[0]} review</div><div class="mu">${fmt(m[1])}</div><button class="g b" onclick="newEntry('${m[0]} review: what has stayed, what has slipped, what next?')">Write</button></div>`).join('')}<h3>Bring it home to Zainab and Hassan</h3><textarea placeholder="What will I share with Zainab? How will I show up differently as a husband and a father? What small practice can we do together?" oninput="S.cfg.home=this.value;save()">${esc(c.home||'')}</textarea><div class="mu">Gentle, not a lecture. Lead by doing.</div>`:''}</div>
<div class="card"><h2>Settings and backup</h2><label class="mu">Name</label><input type="text" value="${esc(c.name||'')}" onchange="S.cfg.name=this.value;save()"><label class="mu">Departure date and time (with zone, e.g. 2026-11-29T20:05:00+11:00)</label><input type="text" value="${esc(c.flightOut||'')}" onchange="S.cfg.flightOut=this.value;save()"><label class="mu">Booking reference</label><input type="text" value="${esc(c.ref||'')}" onchange="S.cfg.ref=this.value;save()"><label class="mu">Munajat rotation starts</label><input type="date" value="${S.mStart}" onchange="S.mStart=this.value;save()"><br><br><div class="row"><button class="b grow" onclick="exp()">Export backup</button><label class="b g grow" style="text-align:center;border:1px solid var(--gold);border-radius:10px;padding:9px">Import<input type="file" accept="application/json" hidden onchange="imp(this.files[0])"></label></div><p class="mu">All data stays on this phone. No accounts, no tracking. Export now and then; iOS can clear site data if storage runs low.</p></div>`;save()};
function share(){const t=summary();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Copied. Paste it in chat.')).catch(()=>{prompt('Copy this:',t)})}
function exp(){const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='swcamp-backup-'+dk()+'.json';a.click();if(navigator.share){}}
function imp(f){if(!f)return;f.text().then(t=>{const o=JSON.parse(t);if(confirm('Replace all data on this phone with this backup?')){S=o;init();save();toast('Restored');go('home')}}).catch(()=>alert('Not a valid backup file'))}
fetch('data.json').then(r=>r.json()).then(d=>{D=d;init();readHash();save();nav();R.home()});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
