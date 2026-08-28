const app = document.getElementById("app");

let currentPage = "home";
let selectedCourse = null;

const progress =
  JSON.parse(localStorage.getItem("cphProgress") || "{}");

function saveProgress(){
  localStorage.setItem("cphProgress", JSON.stringify(progress));
}

function courseProgress(id){
  return progress[id] || 0;
}

function markComplete(id){
  progress[id] = 100;
  saveProgress();
  render();
}

function findCourse(id){
  return curriculum.find(c => c.id === id);
}

function render(){

  if(currentPage === "home") renderHome();
  if(currentPage === "courses") renderCourses();
  if(currentPage === "study") renderStudy();
  if(currentPage === "mcqs") renderMCQs();
  if(currentPage === "papers") renderPapers();
  if(currentPage === "calculations") renderCalculations();
  if(currentPage === "progress") renderProgress();
}

function renderHome(){

  app.innerHTML = `
    <section class="hero">
      <h1>Welcome to CPH STUDY</h1>
      <p>
        A structured Certificate in Pharmacy learning and
        revision platform.
      </p>

      <input
        id="searchBox"
        class="search"
        placeholder="🔎 Search courses, topics and subjects..."
      >
    </section>

    <div class="grid">

      <div class="card">
        <h3>📚 Courses</h3>
        <p>${curriculum.length} course units available.</p>
        <button onclick="go('courses')">Open Courses</button>
      </div>

      <div class="card">
        <h3>📝 MCQs</h3>
        <p>Test your understanding with practice questions.</p>
        <button onclick="go('mcqs')">Start MCQs</button>
      </div>

      <div class="card">
        <h3>📄 Mock Papers</h3>
        <p>Practise structured examination-style questions.</p>
        <button onclick="go('papers')">Open Papers</button>
      </div>

      <div class="card">
        <h3>🧮 Calculations</h3>
        <p>Study pharmaceutical calculations step by step.</p>
        <button onclick="go('calculations')">Study Calculations</button>
      </div>

    </div>

    <section class="section">
      <h2>🎯 Study workflow</h2>
      <ol>
        <li>Select a CPH level.</li>
        <li>Select a course unit.</li>
        <li>Study the notes.</li>
        <li>Test yourself with MCQs.</li>
        <li>Practise structured questions.</li>
        <li>Attempt mock papers.</li>
        <li>Track your progress.</li>
      </ol>
    </section>
  `;

  document.getElementById("searchBox")
    .addEventListener("input", e => searchCourses(e.target.value));
}

function searchCourses(query){

  query = query.toLowerCase().trim();

  if(!query){
    renderCourses();
    return;
  }

  const results = curriculum.filter(c =>
    `${c.name} ${c.level} ${c.code}`
      .toLowerCase()
      .includes(query)
  );

  app.innerHTML = `
    <section class="section">
      <h2>Search results</h2>
      <div class="grid">
        ${results.map(courseCard).join("") ||
          "<p>No matching course found.</p>"}
      </div>
    </section>
  `;
}

function courseCard(c){

  return `
    <div class="card">
      <span class="badge">${c.level}</span>
      <h3>${c.code}</h3>
      <p>${c.name}</p>
      <p><strong>${courseProgress(c.id)}%</strong> complete</p>
      <button onclick="openCourse('${c.id}')">
        Open Course
      </button>
    </div>
  `;
}

function renderCourses(){

  const levels =
    [...new Set(curriculum.map(c => c.level))];

  app.innerHTML = `
    <section class="section">
      <h1>📚 CPH Curriculum</h1>
      <p>
        Select a level and course unit to begin.
      </p>
    </section>

    ${levels.map(level => `

      <section class="section">
        <h2>${level}</h2>

        <div class="grid">
          ${curriculum
            .filter(c => c.level === level)
            .map(courseCard)
            .join("")}
        </div>
      </section>

    `).join("")}
  `;
}

function openCourse(id){

  selectedCourse = id;
  currentPage = "study";

  renderStudy();
}

function renderStudy(){

  if(!selectedCourse){

    app.innerHTML = `
      <section class="section">
        <h1>📖 Study Centre</h1>
        <p>Select a course unit.</p>
        <button class="primary"
          onclick="go('courses')">
          Browse Courses
        </button>
      </section>
    `;

    return;
  }

  const c = findCourse(selectedCourse);
  const content = notes[selectedCourse];

  if(!content){

    app.innerHTML = `
      <section class="section">
        <h1>${c.name}</h1>
        <p>
          Content is being prepared for this course.
        </p>
        <button onclick="go('courses')">
          Back to Courses
        </button>
      </section>
    `;

    return;
  }

  app.innerHTML = `
    <section class="section">

      <span class="badge">${c.level}</span>

      <h1>${c.name}</h1>

      <p>${content.description || ""}</p>

      ${content.topics.map(t => `
        <article class="topic">
          <h3>${t.title}</h3>
          <div>${t.body}</div>
        </article>
      `).join("")}

      <br>

      <button class="primary"
        onclick="markComplete('${c.id}')">
        ✓ Mark Course Complete
      </button>

      <button class="secondary"
        onclick="go('courses')">
        Back
      </button>

    </section>
  `;
}

function renderMCQs(){

  const available =
    Object.keys(mcqs || {});

  app.innerHTML = `
    <section class="section">
      <h1>📝 MCQ Centre</h1>
      <p>Select a course to practise.</p>

      <div class="grid">
        ${available.map(id => {

          const c = findCourse(id);

          if(!c) return "";

          return `
            <div class="card">
              <h3>${c.name}</h3>
              <p>${mcqs[id].length} practice questions</p>
              <button
                onclick="startMCQ('${id}')">
                Start
              </button>
            </div>
          `;

        }).join("")}
      </div>
    </section>
  `;
}

function startMCQ(id){

  const questions = mcqs[id] || [];

  let score = 0;
  let current = 0;

  function show(){

    if(current >= questions.length){

      app.innerHTML = `
        <section class="section">
          <h1>Result</h1>
          <h2>${score}/${questions.length}</h2>
          <button onclick="go('mcqs')">
            Back to MCQs
          </button>
        </section>
      `;

      return;
    }

    const q = questions[current];

    app.innerHTML = `
      <section class="section">

        <span class="badge">
          Question ${current + 1}/${questions.length}
        </span>

        <h2>${q.question}</h2>

        ${q.options.map((o,i) => `
          <button class="option"
            onclick="answerMCQ(${i})">
            ${String.fromCharCode(65+i)}. ${o}
          </button>
        `).join("")}

        <div id="feedback"></div>

      </section>
    `;

    window.answerMCQ = function(i){

      const buttons =
        document.querySelectorAll(".option");

      buttons.forEach(b => b.disabled = true);

      if(i === q.answer){

        buttons[i].classList.add("correct");
        score++;

        document.getElementById("feedback").innerHTML =
          `<div class="answer">
             <strong>Correct.</strong>
             ${q.explanation || ""}
           </div>`;

      }else{

        buttons[i].classList.add("wrong");
        buttons[q.answer].classList.add("correct");

        document.getElementById("feedback").innerHTML =
          `<div class="answer">
             <strong>Incorrect.</strong>
             Correct answer:
             ${q.options[q.answer]}.
             ${q.explanation || ""}
           </div>`;
      }

      setTimeout(() => {
        current++;
        show();
      }, 1200);
    };
  }

  show();
}

function renderPapers(){

  app.innerHTML = `
    <section class="section">
      <h1>📄 Mock Examination Papers</h1>
      <p>
        These are revision/mock papers, not official examination papers.
      </p>

      <div class="grid">
        ${curriculum.map(c => `
          <div class="card">
            <h3>${c.name}</h3>
            <p>20 practice papers</p>
            <button onclick="openPapers('${c.id}')">
              View Papers
            </button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function openPapers(id){

  const c = findCourse(id);
  const data = papers[id];

  app.innerHTML = `
    <section class="section">
      <h1>${c.name}</h1>

      ${
        data
        ? data.map((p,i) => `
          <article class="topic">
            <h3>Paper ${i+1}</h3>
            ${p.questions.map((q,n) =>
              `<p><strong>${n+1}.</strong> ${q}</p>`
            ).join("")}
          </article>
        `).join("")
        : "<p>Practice papers are being prepared.</p>"
      }

      <button onclick="go('papers')">
        Back
      </button>
    </section>
  `;
}

function renderCalculations(){

  app.innerHTML = `

    <section class="section">

      <h1>🧮 Pharmaceutical Calculations</h1>

      <article class="topic">
        <h2>Dilution</h2>

        <p><strong>C₁V₁ = C₂V₂</strong></p>

        <p>
          C₁ = initial concentration<br>
          V₁ = volume of stock required<br>
          C₂ = desired concentration<br>
          V₂ = final volume
        </p>

        <h3>Worked example</h3>

        <p>
          Prepare 100 mL of a 10% solution from a
          25% stock solution.
        </p>

        <p>
          25 × V₁ = 10 × 100
        </p>

        <p>
          V₁ = 40 mL
        </p>

        <p>
          Therefore, measure 40 mL of stock and add
          vehicle to the required final volume.
        </p>
      </article>

      <article class="topic">
        <h2>Percentage strength</h2>

        <p>
          % w/v = grams of solute per 100 mL solution.
        </p>

        <p>
          % w/w = grams of solute per 100 g preparation.
        </p>

        <p>
          % v/v = mL of liquid solute per 100 mL solution.
        </p>
      </article>

      <article class="topic">
        <h2>Ratio strength</h2>

        <p>
          A ratio such as 1:1000 represents
          1 part of active substance in 1000 parts
          of the preparation.
        </p>
      </article>

      <article class="topic">
        <h2>Alligation</h2>

        <p>
          Alligation can be used to determine the
          relative quantities of two preparations of
          different strengths required to obtain
          an intermediate strength.
        </p>
      </article>

      <article class="topic">
        <h2>Further calculation topics</h2>

        <ul>
          <li>Unit conversions</li>
          <li>Weights and volumes</li>
          <li>Concentration calculations</li>
          <li>Dose calculations</li>
          <li>Percentage calculations</li>
          <li>Ratio calculations</li>
          <li>Dilution calculations</li>
          <li>Alligation calculations</li>
          <li>Quantity calculations</li>
          <li>Reconstitution calculations</li>
        </ul>
      </article>

    </section>
  `;
}

function renderProgress(){

  const completed =
    curriculum.filter(c =>
      courseProgress(c.id) === 100
    ).length;

  app.innerHTML = `
    <section class="section">

      <h1>📊 My Progress</h1>

      <h2>
        ${completed} / ${curriculum.length}
        courses completed
      </h2>

      <div class="grid">

        ${curriculum.map(c => `
          <div class="card">
            <h3>${c.code}</h3>
            <p>${c.name}</p>
            <strong>
              ${courseProgress(c.id)}%
            </strong>
          </div>
        `).join("")}

      </div>

    </section>
  `;
}

function go(page){

  currentPage = page;

  if(page !== "study")
    selectedCourse = null;

  render();
}

document.querySelectorAll(".nav button")
  .forEach(btn => {

    btn.addEventListener("click", () =>
      go(btn.dataset.page)
    );

  });

document.getElementById("themeBtn")
  .addEventListener("click", () => {

    document.body.classList.toggle("dark");

  });

render();
