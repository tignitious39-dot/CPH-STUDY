/* =========================================================
   CPH STUDY - MAIN APPLICATION
   ========================================================= */

"use strict";

/* ---------- GLOBAL STATE ---------- */

const app = document.getElementById("app");

let currentPage = "home";
let selectedCourse = null;
let selectedTopic = null;

let mcqState = {
  courseId: null,
  questions: [],
  index: 0,
  score: 0,
  answered: false
};

let progress =
  JSON.parse(localStorage.getItem("cphProgress") || "{}");

let scores =
  JSON.parse(localStorage.getItem("cphScores") || "{}");

let bookmarks =
  JSON.parse(localStorage.getItem("cphBookmarks") || "[]");


/* ---------- STORAGE ---------- */

function saveAll(){

  localStorage.setItem(
    "cphProgress",
    JSON.stringify(progress)
  );

  localStorage.setItem(
    "cphScores",
    JSON.stringify(scores)
  );

  localStorage.setItem(
    "cphBookmarks",
    JSON.stringify(bookmarks)
  );
}


/* ---------- COURSE HELPERS ---------- */

function getCourse(id){

  if(typeof curriculum === "undefined"){
    return null;
  }

  return curriculum.find(c => c.id === id);
}


function getCourseName(id){

  const course = getCourse(id);

  return course ? course.name : id;
}


function getCourseProgress(id){

  return Number(progress[id] || 0);
}


function setCourseProgress(id, value){

  progress[id] = Math.max(
    0,
    Math.min(100, Number(value))
  );

  saveAll();
}


/* ---------- NAVIGATION ---------- */

function go(page){

  currentPage = page;

  if(page !== "study"){
    selectedTopic = null;
  }

  render();
}


window.go = go;


function openCourse(id){

  selectedCourse = id;
  selectedTopic = null;
  currentPage = "study";

  render();
}


window.openCourse = openCourse;


/* ---------- MAIN RENDERER ---------- */

function render(){

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

  switch(currentPage){

    case "home":
      renderHome();
      break;

    case "courses":
      renderCourses();
      break;

    case "study":
      renderStudy();
      break;

    case "mcqs":
      renderMCQs();
      break;

    case "papers":
      renderPapers();
      break;

    case "calculations":
      renderCalculations();
      break;

    case "progress":
      renderProgress();
      break;

    default:
      renderHome();
  }

  updateActiveNav();
}


/* ---------- ACTIVE NAV ---------- */

function updateActiveNav(){

  document
    .querySelectorAll(".nav button")
    .forEach(button => {

      button.style.fontWeight =
        button.dataset.page === currentPage
          ? "700"
          : "400";

    });
}


/* =========================================================
   HOME
   ========================================================= */

function renderHome(){

  const totalCourses =
    typeof curriculum !== "undefined"
      ? curriculum.length
      : 0;

  const completed =
    typeof curriculum !== "undefined"
      ? curriculum.filter(
          c => getCourseProgress(c.id) === 100
        ).length
      : 0;

  const totalQuestions =
    typeof mcqs !== "undefined"
      ? Object.values(mcqs)
          .reduce(
            (sum, arr) =>
              sum + (Array.isArray(arr) ? arr.length : 0),
            0
          )
      : 0;

  app.innerHTML = `

    <section class="hero">

      <h1>⚕️ CPH STUDY</h1>

      <p>
        Learn • Practise • Master
      </p>

      <p>
        Your Certificate in Pharmacy
        study and revision platform.
      </p>

      <input
        id="globalSearch"
        class="search"
        placeholder="🔎 Search a course..."
        autocomplete="off"
      >

    </section>


    <section class="grid">

      <div class="card">
        <h3>📚 Courses</h3>
        <h2>${totalCourses}</h2>
        <p>Course units</p>

        <button
          class="primary"
          onclick="go('courses')">
          Browse Courses
        </button>
      </div>


      <div class="card">
        <h3>📝 MCQs</h3>
        <h2>${totalQuestions}</h2>
        <p>Practice questions currently loaded</p>

        <button
          class="primary"
          onclick="go('mcqs')">
          Practise MCQs
        </button>
      </div>


      <div class="card">
        <h3>📊 Progress</h3>
        <h2>${completed}/${totalCourses}</h2>
        <p>Courses completed</p>

        <button
          class="primary"
          onclick="go('progress')">
          View Progress
        </button>
      </div>


      <div class="card">
        <h3>🧮 Calculations</h3>
        <p>
          Dilution, percentage strength,
          ratio strength, alligation and more.
        </p>

        <button
          class="primary"
          onclick="go('calculations')">
          Open Calculations
        </button>
      </div>

    </section>


    <section class="section">

      <h2>🚀 Quick Start</h2>

      <div class="grid">

        <div class="card">
          <h3>1️⃣ Choose a course</h3>
          <p>
            Select the CPH level and subject
            you want to study.
          </p>
        </div>

        <div class="card">
          <h3>2️⃣ Study</h3>
          <p>
            Read the available notes and topics.
          </p>
        </div>

        <div class="card">
          <h3>3️⃣ Test yourself</h3>
          <p>
            Attempt MCQs without seeing
            the answer beforehand.
          </p>
        </div>

        <div class="card">
          <h3>4️⃣ Track progress</h3>
          <p>
            Record completed courses and
            your practice scores.
          </p>
        </div>

      </div>

    </section>


    <section class="section">

      <h2>🔖 Bookmarked Courses</h2>

      <div id="homeBookmarks">
        ${renderBookmarkCards()}
      </div>

    </section>
  `;


  const search =
    document.getElementById("globalSearch");

  if(search){

    search.addEventListener(
      "input",
      e => searchCourses(e.target.value)
    );

  }
}


/* ---------- SEARCH ---------- */

function searchCourses(query){

  query =
    String(query || "")
      .trim()
      .toLowerCase();

  if(!query){

    renderHome();
    return;
  }

  const results =
    curriculum.filter(course =>
      `${course.id} ${course.code} ${course.level} ${course.name}`
        .toLowerCase()
        .includes(query)
    );

  app.innerHTML = `

    <section class="section">

      <button
        class="secondary"
        onclick="go('home')">
        ← Home
      </button>

      <h1>🔎 Search Results</h1>

      <p>
        ${results.length} matching course(s)
      </p>

      <div class="grid">

        ${
          results.length
            ? results.map(courseCard).join("")
            : "<p>No matching course was found.</p>"
        }

      </div>

    </section>
  `;
}


window.searchCourses = searchCourses;


/* =========================================================
   COURSES
   ========================================================= */

function courseCard(course){

  const bookmarked =
    bookmarks.includes(course.id);

  return `

    <div class="card">

      <span class="badge">
        ${escapeHTML(course.level)}
      </span>

      <h3>
        ${escapeHTML(course.name)}
      </h3>

      <p>
        <strong>${escapeHTML(course.code)}</strong>
      </p>

      <p>
        Progress:
        <strong>${getCourseProgress(course.id)}%</strong>
      </p>

      <div style="margin-top:10px">

        <button
          class="primary"
          onclick="openCourse('${course.id}')">
          📖 Study
        </button>

        <button
          class="secondary"
          onclick="toggleBookmark('${course.id}')">
          ${bookmarked ? "★ Saved" : "☆ Bookmark"}
        </button>

      </div>

    </div>
  `;
}


function renderCourses(){

  if(typeof curriculum === "undefined"){

    app.innerHTML = `
      <section class="section">
        <h2>Curriculum unavailable</h2>
        <p>
          Check that data/curriculum.js exists
          and is loaded before app.js.
        </p>
      </section>
    `;

    return;
  }

  const levels =
    [...new Set(curriculum.map(c => c.level))];

  app.innerHTML = `

    <section class="section">

      <h1>📚 CPH Curriculum</h1>

      <p>
        Select any course to open its study area.
      </p>

    </section>


    ${levels.map(level => `

      <section class="section">

        <h2>${escapeHTML(level)}</h2>

        <div class="grid">

          ${
            curriculum
              .filter(c => c.level === level)
              .map(courseCard)
              .join("")
          }

        </div>

      </section>

    `).join("")}
  `;
}


/* =========================================================
   STUDY
   ========================================================= */

function renderStudy(){

  if(!selectedCourse){

    app.innerHTML = `

      <section class="section">

        <h1>📖 Study Centre</h1>

        <p>
          Select a course to begin studying.
        </p>

        <button
          class="primary"
          onclick="go('courses')">
          📚 Browse Courses
        </button>

      </section>
    `;

    return;
  }

  const course =
    getCourse(selectedCourse);

  const content =
    typeof notes !== "undefined"
      ? notes[selectedCourse]
      : null;

  if(!course){

    app.innerHTML = `
      <section class="section">
        <h2>Course not found.</h2>
        <button onclick="go('courses')">
          Back to Courses
        </button>
      </section>
    `;

    return;
  }

  if(!content){

    app.innerHTML = `

      <section class="section">

        <button
          class="secondary"
          onclick="go('courses')">
          ← Courses
        </button>

        <h1>${escapeHTML(course.name)}</h1>

        <p>
          Notes for this course have not yet
          been added to data/notes.js.
        </p>

      </section>
    `;

    return;
  }


  const topics =
    Array.isArray(content.topics)
      ? content.topics
      : [];


  app.innerHTML = `

    <section class="section">

      <button
        class="secondary"
        onclick="go('courses')">
        ← Courses
      </button>

      <span class="badge">
        ${escapeHTML(course.level)}
      </span>

      <h1>
        ${escapeHTML(course.name)}
      </h1>

      <p>
        ${content.description || ""}
      </p>

      <p>
        <strong>
          Progress: ${getCourseProgress(course.id)}%
        </strong>
      </p>

      <div class="grid">

        ${topics.map((topic,index) => `

          <div class="card">

            <h3>
              ${escapeHTML(topic.title)}
            </h3>

            <button
              class="primary"
              onclick="openTopic(${index})">
              Open Topic
            </button>

          </div>

        `).join("")}

      </div>

    </section>
  `;


  if(selectedTopic !== null){

    openTopic(selectedTopic);
  }
}


window.openTopic = function(index){

  selectedTopic = index;

  const content =
    notes[selectedCourse];

  const topic =
    content &&
    Array.isArray(content.topics)
      ? content.topics[index]
      : null;

  if(!topic) return;


  const existing =
    document.getElementById("topicViewer");

  if(existing){
    existing.remove();
  }


  const section =
    document.createElement("section");

  section.id = "topicViewer";
  section.className = "section";

  section.innerHTML = `

    <button
      class="secondary"
      onclick="closeTopic()">
      ← Back to Topics
    </button>

    <h1>
      ${escapeHTML(topic.title)}
    </h1>

    <div class="topic">
      ${topic.body || ""}
    </div>

    <br>

    <button
      class="primary"
      onclick="completeTopic('${selectedCourse}',${index})">
      ✓ Mark Topic Complete
    </button>

    <button
      class="secondary"
      onclick="bookmarkTopic('${selectedCourse}',${index})">
      🔖 Bookmark Topic
    </button>

  `;

  app.appendChild(section);

  section.scrollIntoView({
    behavior:"smooth"
  });
};


window.closeTopic = function(){

  selectedTopic = null;

  renderStudy();
};


window.completeTopic =
function(courseId,index){

  const content =
    notes[courseId];

  const total =
    content &&
    Array.isArray(content.topics)
      ? content.topics.length
      : 1;

  const old =
    getCourseProgress(courseId);

  const increment =
    Math.ceil(100 / total);

  setCourseProgress(
    courseId,
    Math.min(100, old + increment)
  );

  renderStudy();
};


/* =========================================================
   BOOKMARKS
   ========================================================= */

function toggleBookmark(id){

  const index =
    bookmarks.indexOf(id);

  if(index === -1){

    bookmarks.push(id);

  }else{

    bookmarks.splice(index,1);
  }

  saveAll();

  render();
}


window.toggleBookmark = toggleBookmark;


function bookmarkTopic(courseId,index){

  const key =
    `${courseId}:topic:${index}`;

  if(!bookmarks.includes(key)){

    bookmarks.push(key);
    saveAll();

    alert("Topic bookmarked.");

  }else{

    alert("Topic is already bookmarked.");
  }
}


window.bookmarkTopic = bookmarkTopic;


function renderBookmarkCards(){

  const courseBookmarks =
    bookmarks.filter(id =>
      typeof id === "string" &&
      curriculum.some(c => c.id === id)
    );

  if(!courseBookmarks.length){

    return `
      <p>
        No bookmarked courses yet.
      </p>
    `;
  }

  return `

    <div class="grid">

      ${courseBookmarks
        .map(id => courseCard(getCourse(id)))
        .join("")}

    </div>
  `;
}


/* =========================================================
   MCQS
   ========================================================= */

function renderMCQs(){

  if(typeof mcqs === "undefined"){

    app.innerHTML = `
      <section class="section">
        <h2>MCQ data unavailable.</h2>
        <p>
          Check data/mcqs.js.
        </p>
      </section>
    `;

    return;
  }


  const available =
    curriculum.filter(course =>
      Array.isArray(mcqs[course.id]) &&
      mcqs[course.id].length > 0
    );


  app.innerHTML = `

    <section class="section">

      <h1>📝 MCQ Centre</h1>

      <p>
        Choose a course and test yourself.
        Answers are revealed after you select an option.
      </p>

    </section>


    <section class="section">

      <div class="grid">

        ${available.map(course => `

          <div class="card">

            <h3>
              ${escapeHTML(course.name)}
            </h3>

            <p>
              ${mcqs[course.id].length}
              questions loaded
            </p>

            <button
              class="primary"
              onclick="startMCQ('${course.id}')">
              ▶ Start Test
            </button>

          </div>

        `).join("")}

      </div>

    </section>
  `;
}


function startMCQ(courseId){

  const source =
    Array.isArray(mcqs[courseId])
      ? mcqs[courseId]
      : [];

  if(!source.length){

    alert("No MCQs are currently loaded for this course.");

    return;
  }


  const shuffled =
    [...source]
      .sort(() => Math.random() - 0.5);


  mcqState = {

    courseId:courseId,

    questions:shuffled,

    index:0,

    score:0,

    answered:false
  };


  showMCQ();
}


window.startMCQ = startMCQ;


function showMCQ(){

  const state = mcqState;

  const q =
    state.questions[state.index];

  if(!q){

    finishMCQ();

    return;
  }


  app.innerHTML = `

    <section class="section">

      <button
        class="secondary"
        onclick="go('mcqs')">
        ← MCQ Centre
      </button>

      <p>
        Question
        <strong>
          ${state.index + 1}
        </strong>
        of
        <strong>
          ${state.questions.length}
        </strong>
      </p>

      <h2>
        ${escapeHTML(q.question)}
      </h2>

      <div id="mcqOptions">

        ${
          q.options.map((option,index) => `

            <button
              class="option"
              onclick="answerMCQ(${index})">

              <strong>
                ${String.fromCharCode(65 + index)}.
              </strong>

              ${escapeHTML(option)}

            </button>

          `).join("")
        }

      </div>

      <div id="mcqFeedback"></div>

    </section>
  `;
}


window.answerMCQ = function(choice){

  if(mcqState.answered) return;

  mcqState.answered = true;

  const q =
    mcqState.questions[mcqState.index];

  const buttons =
    document.querySelectorAll(".option");

  buttons.forEach(
    button => button.disabled = true
  );


  if(choice === q.answer){

    mcqState.score++;

    buttons[choice]
      .classList.add("correct");

  }else{

    buttons[choice]
      .classList.add("wrong");

    if(buttons[q.answer]){

      buttons[q.answer]
        .classList.add("correct");
    }
  }


  const feedback =
    document.getElementById("mcqFeedback");


  feedback.innerHTML = `

    <div class="answer">

      <strong>
        ${
          choice === q.answer
            ? "✓ Correct"
            : "✗ Incorrect"
        }
      </strong>

      <p>
        <strong>
          Correct answer:
        </strong>

        ${escapeHTML(q.options[q.answer])}
      </p>

      <p>
        ${q.explanation || ""}
      </p>

      <button
        class="primary"
        onclick="nextMCQ()">

        ${
          mcqState.index + 1
          === mcqState.questions.length
            ? "View Result"
            : "Next Question →"
        }

      </button>

    </div>
  `;
};


window.nextMCQ = function(){

  mcqState.index++;

  mcqState.answered = false;

  showMCQ();
};


function finishMCQ(){

  const courseId =
    mcqState.courseId;

  const total =
    mcqState.questions.length;

  const score =
    mcqState.score;

  const percent =
    total
      ? Math.round((score / total) * 100)
      : 0;


  if(!scores[courseId]){
    scores[courseId] = [];
  }

  scores[courseId].push({

    date:new Date().toISOString(),

    score:score,

    total:total,

    percent:percent

  });


  saveAll();


  app.innerHTML = `

    <section class="section">

      <h1>🎉 Test Complete</h1>

      <h2>
        ${score}/${total}
      </h2>

      <h2>
        ${percent}%
      </h2>

      <p>
        Course:
        <strong>
          ${escapeHTML(getCourseName(courseId))}
        </strong>
      </p>

      <button
        class="primary"
        onclick="startMCQ('${courseId}')">
        🔄 Try Again
      </button>

      <button
        class="secondary"
        onclick="go('mcqs')">
        ← MCQ Centre
      </button>

    </section>
  `;
}


/* =========================================================
   PAPERS
   ========================================================= */

function renderPapers(){

  app.innerHTML = `

    <section class="section">

      <h1>📄 Mock Paper Centre</h1>

      <p>
        These are practice/mock papers generated
        from the question bank. They are not
        represented as official examination papers.
      </p>

    </section>


    <section class="section">

      <div class="grid">

        ${curriculum.map(course => `

          <div class="card">

            <h3>
              ${escapeHTML(course.name)}
            </h3>

            <p>
              20 practice-paper slots
            </p>

            <button
              class="primary"
              onclick="openPapers('${course.id}')">
              📄 View Papers
            </button>

          </div>

        `).join("")}

      </div>

    </section>
  `;
}


window.openPapers = function(courseId){

  const course =
    getCourse(courseId);

  const questions =
    typeof mcqs !== "undefined" &&
    Array.isArray(mcqs[courseId])
      ? mcqs[courseId]
      : [];


  if(!questions.length){

    app.innerHTML = `

      <section class="section">

        <button
          class="secondary"
          onclick="go('papers'
