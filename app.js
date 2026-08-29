const COURSES={
  "CPH 1.1":[
   ["Microbiology","🦠","microbiology"],["Anatomy & Physiology 1","🍎","anatomy1"],["Pharmaceutical Chemistry 1","⚗️","chemistry1"],
   ["First Aid","✚","firstaid"],["Primary Health Care (PHC)","🏠","phc"],["Computer Applications","💻","computer"]
 ],
 "CPH 1.2":[
   ["Anatomy & Physiology 2","🍎","anatomy2"],["Pharmaceutical Chemistry 2","⚗️","chemistry2"],["Pharmaceutical Calculations","▤","calculations"],
   ["Pharmacognosy","🌿","pharmacognosy"],["Pharmacology 1","💊","pharmacology1"],["Medical Psychology","🧠","psychology"],
   ["Communication Skills","💬","communication"],["Pharmaceutical Practicals","🧪","practicals"]
 ],
 "CPH 2.1":[
   ["To be added","❓","tba"],["Pharmaceutics 1","⚗️","pharmaceutics1"],["Pharmacy Laws & Regulations","⚖️","laws"],
   ["Pharmacy Practice 1","🏥","practice1"],["Therapeutics 1","💊","therapeutics1"],["Pharmacology 2","💊","pharmacology2"],["Stores & Inventory Management","📦","stores"]
 ],
 "CPH 2.2":[
   ["Pharmaceutics 2","⚗️","pharmaceutics2"],["Quality Assurance of Pharmaceuticals","🔬","qa"],["Pharmacy Practice 2","🏥","practice2"],
   ["Therapeutics 2","💊","therapeutics2"],["Entrepreneurship","💼","entrepreneurship"]
 ]
};

const NOTES={
 microbiology:{title:"Microbiology",overview:"Microbiology is the study of microorganisms and their interactions with humans, medicines and the environment.",sections:[
  ["Overview","Microorganisms include bacteria, fungi, protozoa and viruses. Bacteria are single-celled prokaryotic organisms."],
  ["Classification","Bacteria can be classified by shape, staining reaction, oxygen requirement, temperature range and biochemical properties."],
  ["Gram staining","Gram-positive bacteria retain the crystal-violet/iodine complex and appear purple; Gram-negative bacteria counterstain pink/red."],
  ["Key points","• Cocci are spherical bacteria.\n• Bacilli are rod-shaped.\n• Spirilla are spiral-shaped.\n• Sterilization destroys all forms of microbial life.\n• Disinfection reduces or eliminates many pathogenic microorganisms on inanimate objects."]
 ]},
 pharmacognosy:{title:"Pharmacognosy",overview:"Pharmacognosy deals with medicinal substances obtained from natural sources.",sections:[
  ["Scope","It covers identification, cultivation, collection, processing, storage, evaluation and uses of crude drugs."],
  ["Alkaloids","Alkaloids are nitrogen-containing natural compounds that often have marked physiological activity."],
  ["Evaluation","Crude drugs may be evaluated by organoleptic, microscopic, physical, chemical and biological methods."]
 ]},
 pharmacology1:{title:"Pharmacology 1",overview:"Pharmacology is the study of drugs, including their actions, effects and movement through the body.",sections:[
  ["Pharmacokinetics","ADME describes absorption, distribution, metabolism and excretion."],
  ["Pharmacodynamics","Pharmacodynamics describes what a drug does to the body, including receptor interactions and dose-response relationships."],
  ["Safety","Dose, route, contraindications, interactions and adverse effects must be considered when medicines are used."]
 ]},
 calculations:{title:"Pharmaceutical Calculations",overview:"Accurate calculation is essential for safe preparation and administration of medicines.",sections:[
  ["Core topics","Percentage strength, dilution, ratio and proportion, allegation, dose calculations, molarity, normality and unit conversions."],
  ["Good practice","Write the known values, identify the required quantity, choose a valid formula, substitute with units, calculate, then check whether the answer is reasonable."],
  ["Example","To prepare 100 mL of a 5% w/v solution, 5 g of solute is required per 100 mL of final preparation."]
 ]}
};

const MCQS=[
 {q:"Which of the following is a Gram-positive bacterium?",a:["E. coli","Staphylococcus aureus","Salmonella typhi","Pseudomonas aeruginosa"],c:1,e:"Staphylococcus aureus is a Gram-positive coccus."},
 {q:"Which term describes rod-shaped bacteria?",a:["Cocci","Bacilli","Vibrios","Spirochaetes"],c:1,e:"Bacilli are rod-shaped bacteria."},
 {q:"What does ADME stand for?",a:["Absorption, Distribution, Metabolism, Excretion","Administration, Dose, Medicine, Effect","Action, Dose, Metabolism, Elimination","Absorption, Dose, Movement, Excretion"],c:0,e:"ADME summarizes the major pharmacokinetic processes."},
 {q:"A 5% w/v solution contains:",a:["5 g in 100 mL","5 mg in 100 mL","5 g in 1 mL","50 g in 100 mL"],c:0,e:"% w/v means grams of solute per 100 mL of solution."},
 {q:"Which is a spherical bacterial shape?",a:["Bacillus","Coccus","Spirillum","Vibrio"],c:1,e:"Cocci are spherical or approximately spherical."}
];

let state=JSON.parse(localStorage.getItem("cph_state")||"null")||{route:"home",bookmarks:[],answered:0,correct:0,streak:1,progress:{}};
let quizIndex=0,quizScore=0,currentCourse=null,currentLevel=null;

function save(){localStorage.setItem("cph_state",JSON.stringify(state))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function setRoute(route,data={}){state.route=route;Object.assign(state,data);save();render();closeDrawer()}
function toast(msg){const x=document.createElement("div");x.className="toast";x.textContent=msg;document.body.appendChild(x);setTimeout(()=>x.remove(),1800)}
function percent(){return state.answered?Math.round(state.correct/state.answered*100):0}

function render(){
 const s=document.getElementById("screen");
 const r=state.route;
 if(r==="home")s.innerHTML=home();
 else if(r==="levels")s.innerHTML=levels();
 else if(r==="level")s.innerHTML=levelPage(state.level);
 else if(r==="course")s.innerHTML=coursePage(state.course);
 else if(r==="notes")s.innerHTML=notesPage(state.course||"microbiology");
 else if(r==="mcqs")s.innerHTML=mcqsPage();
 else if(r==="quizzes")s.innerHTML=quizPage();
 else if(r==="calculations")s.innerHTML=calculationsPage();
 else if(r==="calculator")s.innerHTML=calculatorPage(state.calcType||"dilution");
 else if(r==="search")s.innerHTML=searchPage();
 else if(r==="bookmarks")s.innerHTML=bookmarksPage();
 else if(r==="discussions")s.innerHTML=discussionPage();
 else if(r==="notifications")s.innerHTML=notificationsPage();
 else if(r==="progress"||r==="activity")s.innerHTML=progressPage();
 else if(r==="profile")s.innerHTML=profilePage();
 bind();
 updateNav();
}

function home(){
 return `<section class="hero"><h1>Hello, Student! 👋</h1><p>Good to see you today. Keep learning and keep progressing.</p><div class="motivation">💡 <b>Daily motivation</b><br>“Small progress made consistently becomes significant progress.”</div></section>
 <div class="section-head"><h2>Quick Access</h2><button class="link-btn" data-route="levels">View all</button></div>
 <div class="grid">
  ${quick("📖","Notes","notes")}${quick("☑","MCQs","mcqs")}${quick("✓","Quizzes","quizzes")}
  ${quick("▤","Calculations","calculations")}${quick("🔖","Bookmarks","bookmarks")}${quick("💬","Discussions","discussions")}
  ${quick("🔔","Notifications","notifications")}${quick("▥","My Progress","progress")}${quick("🔎","Search","search")}
 </div>
 <div class="section-head"><h2>CPH Levels</h2><button class="link-btn" data-route="levels">Open</button></div>
 <div class="level-grid">${levelMini("CPH 1.1","6 Course Units","l11","1.1")}${levelMini("CPH 1.2","8 Course Units","l12","1.2")}${levelMini("CPH 2.1","7 Course Units","l21","2.1")}${levelMini("CPH 2.2","5 Course Units","l22","2.2")}</div>`;
}

function quick(i,t,r){return `<button class="quick" data-route="${r}"><div class="qicon">${i}</div><b>${t}</b></button>`}
function levelMini(n,p,c,id){let lev=n;return `<button class="level ${c}" data-level="${esc(lev)}"><h3>${n}</h3><p>${p}</p><span>›</span></button>`}

function levels(){return `<h1 class="page-title">CPH Levels</h1><p class="subtitle">Choose your certificate level and course unit.</p><div class="level-grid">${levelMini("CPH 1.1","6 Course Units","l11","1.1")}${levelMini("CPH 1.2","8 Course Units","l12","1.2")}${levelMini("CPH 2.1","7 Course Units","l21","2.1")}${levelMini("CPH 2.2","5 Course Units","l22","2.2")}</div>`}

function levelPage(level){return `<button class="secondary" data-route="levels">← Back</button><h1 class="page-title" style="margin-top:13px">${esc(level)}</h1><p class="subtitle">${COURSES[level].length} course units</p><div class="course-list">${COURSES[level].map(c=>courseCard(c,level)).join("")}</div>`}

function courseCard(c,l){return `<button class="course-card" data-course="${esc(c[2])}" data-level="${esc(l)}"><div class="emoji">${c[1]}</div><div class="grow"><b>${esc(c[0])}</b><small>${esc(l)} • Tap to study</small></div><span class="arrow">›</span></button>`}

function coursePage(course){
 let title=findCourse(course)||NOTES[course]?.title||"Course";
 return `<button class="secondary" data-route="level" data-level="${esc(state.level||"CPH 1.2")}">← Back</button><div class="card" style="margin-top:12px"><div class="avatar-icon">📚</div><h1 class="page-title">${esc(title)}</h1><p class="subtitle">Learn • Practice • Master</p>
 <div class="progressbar"><span style="width:${state.progress[course]||0}%"></span></div><small>${state.progress[course]||0}% course progress</small></div>
 <div class="tabs"><button class="tab active">Study</button><button class="tab" data-route="notes" data-course="${esc(course)}">Notes</button><button class="tab" data-route="mcqs">MCQs</button><button class="tab" data-route="quizzes">Tests</button></div>
 <div class="card"><h3>Course overview</h3><p class="note-body">${esc(NOTES[course]?.overview||"Course materials will be organized here. Select Notes, MCQs or Tests to continue studying.")}</p></div>
 <div class="section-head"><h2>Study tools</h2></div>
 ${toolCard("📖","Read Notes","Structured explanations and key points","notes",course)}
 ${toolCard("☑","Practice MCQs","Test your understanding","mcqs",course)}
 ${toolCard("✓","Take a Quiz","Timed-style practice questions","quizzes",course)}
 ${toolCard("🔖","Save for later","Bookmark this course","bookmark",course)}`;
}

function toolCard(i,t,d,r,c){return `<button class="card list-card" data-route="${r}" data-course="${esc(c)}"><div class="avatar-icon">${i}</div><div class="grow"><b>${t}</b><small>${d}</small></div><span class="arrow">›</span></button>`}
function findCourse(id){for(const [l,arr] of Object.entries(COURSES)){const c=arr.find(x=>x[2]===id);if(c)return c[0]}return null}

function notesPage(course){
 const n=NOTES[course]||{title:findCourse(course)||"Course Notes",overview:"Notes for this course are ready to be expanded with your official curriculum.",sections:[["Key points","Study each topic systematically and revise with MCQs after reading."]]};
 return `<button class="secondary" data-route="course" data-course="${esc(course)}">← Back</button><div class="card" style="margin-top:12px"><h1 class="page-title">${esc(n.title)}</h1><p class="subtitle">Notes • Key Points • Revision</p><div class="tabs"><button class="tab active">Notes</button><button class="tab">Key Points</button><button class="tab" data-route="mcqs">MCQs</button><button class="tab" data-route="quizzes">Tests</button></div><div class="note-body"><h3>Overview</h3><p>${esc(n.overview)}</p>${n.sections.map(x=>`<h3>${esc(x[0])}</h3><p>${esc(x[1]).replace(/\n/g,"<br>")}</p>`).join("")}</div></div>`;
}

function mcqsPage(){
 return `<h1 class="page-title">MCQs</h1><p class="subtitle">Practice questions and track your performance.</p><div class="stat-grid"><div class="stat"><strong>${state.answered}</strong><small>Answered</small></div><div class="stat"><strong>${state.correct}</strong><small>Correct</small></div><div class="stat"><strong>${percent()}%</strong><small>Accuracy</small></div></div><div class="section-head"><h2>Question Bank</h2></div>${MCQS.map((x,i)=>`<button class="card list-card" data-mcq="${i}"><div class="avatar-icon">☑</div><div class="grow"><b>Question ${i+1}</b><small>${esc(x.q)}</small></div><span class="arrow">›</span></button>`).join("")}`;
}

function quizPage(){
 const x=MCQS[quizIndex%MCQS.length];
 return `<button class="secondary" data-route="mcqs">← Back</button><div class="card" style="margin-top:12px"><small>Question ${(quizIndex%MCQS.length)+1} / ${MCQS.length}</small><div class="progressbar" style="margin:8px 0 18px"><span style="width:${((quizIndex%MCQS.length)+1)/MCQS.length*100}%"></span></div><div class="quiz-question">${esc(x.q)}</div><div id="options">${x.a.map((a,i)=>`<button class="option" data-answer="${i}">${String.fromCharCode(65+i)}. ${esc(a)}</button>`).join("")}</div><div id="feedback"></div></div>`;
}

function calculationsPage(){
 const items=[["💧","Dilution","C₁V₁ = C₂V₂","dilution"],["🟡","Allegation","Mixing two strengths","allegation"],["💗","Percentage Strength","% w/v, w/w, v/v","percentage"],["🔢","Ratio & Proportion","Compare quantities","ratio"],["🔬","Molarity & Normality","M and N calculations","molarity"],["📏","Dose Calculations","Dose and volume","dose"],["🔄","Unit Conversions","Mass, volume, units","units"],["👶","Pediatric Calculations","Age/weight-based examples","pediatric"],["🧮","Practice Problems","Mixed calculations","practice"]];
 return `<h1 class="page-title">Pharmaceutical Calculations</h1><p class="subtitle">Choose a calculation topic.</p><div class="calc-grid">${items.map(x=>`<button class="calc-tile" data-calc="${x[3]}"><div class="emoji">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></button>`).join("")}</div>`;
}

function calculatorPage(type){
 const titles={dilution:"Dilution",allegation:"Allegation",percentage:"Percentage Strength",ratio:"Ratio & Proportion",molarity:"Molarity & Normality",dose:"Dose Calculations",units:"Unit Conversions",pediatric:"Pediatric Calculations",practice:"Practice Problems"};
 if(type==="dilution")return `<button class="secondary" data-route="calculations">← Calculations</button><h1 class="page-title" style="margin-top:13px">Dilution</h1><p class="subtitle">Use C₁V₁ = C₂V₂.</p><div class="card">${field("C₁","Starting concentration","c1")}${field("V₁","Volume taken","v1")}${field("C₂","Required concentration","c2")}<button class="primary" id="calcDil">Calculate V₂</button><div id="calcResult"></div></div>`;
 if(type==="percentage")return `<button class="secondary" data-route="calculations">← Calculations</button><h1 class="page-title" style="margin-top:13px">Percentage Strength</h1><p class="subtitle">% w/v = grams per 100 mL.</p><div class="card">${field("Mass (g)","Mass of solute","mass")}${field("Volume (mL)","Final volume","vol")}<button class="primary" id="calcPct">Calculate % w/v</button><div id="calcResult"></div></div>`;
 if(type==="dose")return `<button class="secondary" data-route="calculations">← Calculations</button><h1 class="page-title" style="margin-top:13px">Dose Calculation</h1><p class="subtitle">Dose required = (Dose ordered ÷ Dose available) × Quantity.</p><div class="card">${field("Dose ordered","e.g. 250 mg","ordered")}${field("Dose available","e.g. 500 mg","available")}${field("Quantity","e.g. 1 tablet or 5 mL","qty")}<button class="primary" id="calcDose">Calculate</button><div id="calcResult"></div></div>`;
 if(type==="units")return `<button class="secondary" data-route="calculations">← Calculations</button><h1 class="page-title" style="margin-top:13px">Unit Conversions</h1><div class="card"><p class="note-body"><b>Mass:</b> 1 g = 1000 mg; 1 mg = 1000 µg.<br><b>Volume:</b> 1 L = 1000 mL; 1 mL = 1000 µL.</p>${field("Value","Enter value","uv")}<select id="from" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:11px;margin-bottom:9px"><option value="g">g → mg</option><option value="mg">mg → µg</option><option value="L">L → mL</option><option value="mL">mL → µL</option></select><button class="primary" id="calcUnit">Convert</button><div id="calcResult"></div></div>`;
 return `<button class="secondary" data-route="calculations">← Calculations</button><h1 class="page-title" style="margin-top:13px">${titles[type]||"Calculation"}</h1><div class="card"><h3>Formula guide</h3><p class="note-body">This calculator section is ready for your detailed course-specific formulas and worked examples. Use Practice Problems for mixed revision.</p></div>`;
}

function field(label,ph,id){return `<div class="form-group"><label>${label}</label><input id="${id}" type="number" step="any" placeholder="${ph}"></div>`}

function searchPage(){
 return `<h1 class="page-title">Global Search</h1><p class="subtitle">Search courses, notes and MCQs.</p><div class="searchbox"><input id="searchInput" placeholder="Search e.g. amoxicillin, bacteria, dilution"><button class="primary" id="searchBtn">⌕</button></div><div id="searchResults" class="course-list"><div class="empty">Type a topic and tap search.</div></div>`;
}

function doSearch(){
 const q=document.getElementById("searchInput").value.trim().toLowerCase(),box=document.getElementById("searchResults");
 if(!q){box.innerHTML='<div class="empty">Enter a search term.</div>';return}
 let results=[];
 Object.entries(COURSES).forEach(([l,arr])=>arr.forEach(c=>{if(c[0].toLowerCase().includes(q))results.push({t:c[0],d:l,r:"course",c:c[2]})}));
 Object.entries(NOTES).forEach(([id,n])=>{let blob=(n.title+" "+n.overview+" "+n.sections.map(s=>s.join(" ")).join(" ")).toLowerCase();if(blob.includes(q))results.push({t:n.title,d:"Notes",r:"notes",c:id})});
 MCQS.forEach((m,i)=>{if((m.q+" "+m.a.join(" ")).toLowerCase().includes(q))results.push({t:"MCQ "+(i+1),d:m.q,r:"quizzes"})});
 box.innerHTML=results.length?results.slice(0,20).map(x=>`<button class="card list-card" data-route="${x.r}" data-course="${x.c||""}"><div class="avatar-icon">🔎</div><div class="grow"><b>${esc(x.t)}</b><small>${esc(x.d)}</small></div><span class="arrow">›</span></button>`).join(""):'<div class="empty">No matching results found.</div>';
}

function bookmarksPage(){
 const arr=state.bookmarks;
 return `<h1 class="page-title">Bookmarks</h1><p class="subtitle">Saved study items.</p>${arr.length?arr.map(id=>`<button class="card list-card" data-route="notes" data-course="${esc(id)}"><div class="avatar-icon">🔖</div><div class="grow"><b>${esc(findCourse(id)||NOTES[id]?.title||id)}</b><small>Saved for revision</small></div><span class="arrow">›</span></button>`).join(""):'<div class="empty">No bookmarks yet. Open a course and save it for later.</div>'}`;
}

function discussionPage(){return `<h1 class="page-title">Discussions</h1><p class="subtitle">Study-focused discussion board.</p><div class="card list-card"><div class="avatar-icon">💬</div><div class="grow"><b>Pharmacognosy – Alkaloids</b><small>Ask questions and share study explanations.</small></div><span class="arrow">›</span></div><div class="card"><h3>Start a discussion</h3><p class="subtitle">This local version stores the interface without requiring a server.</p><button class="primary" onclick="toast('Discussion feature ready for backend connection')">Create discussion</button></div>`}

function notificationsPage(){return `<h1 class="page-title">Notifications</h1><p class="subtitle">Your latest study activity.</p>${["New quiz available","Daily study reminder","Achievement: 100 MCQs","Motivational message"].map((x,i)=>`<div class="card list-card"><div class="avatar-icon">${["📝","🔔","🏆","💡"][i]}</div><div class="grow"><b>${x}</b><small>${i+1} day${i?"s":""} ago • CPH STUDY</small></div><span>●</span></div>`).join("")}`}

function progressPage(){return `<h1 class="page-title">My Progress</h1><p class="subtitle">Keep going — you are doing great.</p><div class="card"><div style="display:flex;justify-content:space-between"><b>Overall Progress</b><b>${percent()}%</b></div><div class="progressbar" style="margin-top:9px"><span style="width:${percent()}%"></span></div></div><div class="stat-grid"><div class="stat"><strong>${state.answered}</strong><small>Questions</small></div><div class="stat"><strong>${state.correct}</strong><small>Correct</small></div><div class="stat"><strong>${state.streak}
