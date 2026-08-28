/* =========================================================
   CPH STUDY - MAIN APP ENGINE
   ========================================================= */

const results = document.getElementById("results");
const searchInput = document.getElementById("search");
const levelsContainer = document.getElementById("levels");
const quoteBox = document.getElementById("quote");

/* =========================================================
   CPH LEVELS
   ========================================================= */

const levels = [
  {
    name: "CPH 1.1",
    description: "Foundation pharmacy and medical sciences",
    topics: [
      "Anatomy & Physiology",
      "Pharmaceutical Calculations",
      "Pharmaceutics",
      "Biochemistry"
    ]
  },
  {
    name: "CPH 1.2",
    description: "Core pharmaceutical knowledge",
    topics: [
      "Pharmacology",
      "Microbiology",
      "Pharmaceutics",
      "Clinical Pharmacy"
    ]
  },
  {
    name: "CPH 2.1",
    description: "Advanced pharmacy studies",
    topics: [
      "Clinical Pharmacy",
      "Pharmacology",
      "Pharmaceutical Technology",
      "Medicine Management"
    ]
  },
  {
    name: "CPH 2.2",
    description: "Advanced revision and examination preparation",
    topics: [
      "Clinical Practice",
      "Pharmacotherapy",
      "Calculations",
      "CPH Revision"
    ]
  }
];

function loadLevels() {

  if (!levelsContainer) return;

  levelsContainer.innerHTML = "";

  levels.forEach((level, index) => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <h3>📚 ${level.name}</h3>
      <p>${level.description}</p>
      <button onclick="openLevel(${index})">
        Explore Level
      </button>
    `;

    levelsContainer.appendChild(card);

  });

}

function openLevel(index) {

  const level = levels[index];

  results.innerHTML = `
    <div class="card">
      <h2>📚 ${level.name}</h2>

      <p>${level.description}</p>

      <h3>Topics</h3>

      <ul>
        ${level.topics.map(topic => `
          <li style="margin:8px 0;">
            ${topic}
          </li>
        `).join("")}
      </ul>

      <br>

      <button onclick="showTool(
        '📝 Quizzes',
        'Practice MCQs and revision questions.'
      )">
        📝 Start Revision
      </button>
    </div>
  `;

  results.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   DAILY MOTIVATION
   ========================================================= */

const quotes = [
  "Small progress every day becomes great achievement.",
  "Study the concept, not just the answer.",
  "Your future pharmacy professional self is built today.",
  "Consistency beats last-minute preparation.",
  "Understand it today. Remember it tomorrow.",
  "Every question you practice makes you stronger.",
  "Learn • Practice • Master.",
  "Do not fear difficult topics. Break them into smaller ideas."
];

function loadQuote() {

  if (!quoteBox) return;

  const day =
    Math.floor(Date.now() / 86400000);

  quoteBox.textContent =
    "💡 " + quotes[day % quotes.length];

}


/* =========================================================
   QUIZ DATABASE
   ========================================================= */

const quizQuestions = [

  {
    subject: "Pharmacology",

    question:
      "What is pharmacology?",

    options: [
      "The study of drugs and their effects",
      "The study of bones only",
      "The study of food",
      "The study of microorganisms only"
    ],

    answer: 0,

    explanation:
      "Pharmacology is the science concerned with drugs and their interactions with living systems."
  },

  {
    subject: "Pharmacology",

    question:
      "What does pharmacokinetics describe?",

    options: [
      "What the drug does to the body",
      "What the body does to the drug",
      "Only adverse effects",
      "Only drug manufacturing"
    ],

    answer: 1,

    explanation:
      "Pharmacokinetics describes the movement of a drug through the body, commonly summarized as ADME."
  },

  {
    subject: "Pharmaceutical Calculations",

    question:
      "Which formula is commonly used for dilution calculations?",

    options: [
      "C₁V₁ = C₂V₂",
      "E = mc²",
      "F = ma",
      "P = IV"
    ],

    answer: 0,

    explanation:
      "C₁V₁ = C₂V₂ is commonly used to calculate dilution of solutions."
  },

  {
    subject: "Pharmaceutical Calculations",

    question:
      "A preparation contains 500 mg in 5 mL. How many mg are in 1 mL?",

    options: [
      "50 mg",
      "100 mg",
      "250 mg",
      "500 mg"
    ],

    answer: 1,

    explanation:
      "500 mg ÷ 5 mL = 100 mg/mL."
  },

  {
    subject: "Anatomy & Physiology",

    question:
      "Which organ pumps blood around the body?",

    options: [
      "Liver",
      "Heart",
      "Kidney",
      "Lung"
    ],

    answer: 1,

    explanation:
      "The heart pumps blood through the cardiovascular system."
  },

  {
    subject: "Anatomy & Physiology",

    question:
      "What is homeostasis?",

    options: [
      "Complete absence of change",
      "Maintenance of a relatively stable internal environment",
      "Digestion of food",
      "Movement of bones"
    ],

    answer: 1,

    explanation:
      "Homeostasis is the maintenance of relatively stable internal conditions."
  },

  {
    subject: "Microbiology",

    question:
      "Microbiology is primarily the study of:",

    options: [
      "Microorganisms",
      "Bones",
      "Medicines only",
      "Macroscopic plants only"
    ],

    answer: 0,

    explanation:
      "Microbiology studies microorganisms such as bacteria, viruses, fungi and protozoa."
  },

  {
    subject: "Pharmaceutics",

    question:
      "Which of the following is a pharmaceutical dosage form?",

    options: [
      "Tablet",
      "Neuron",
      "Artery",
      "Enzyme"
    ],

    answer: 0,

    explanation:
      "A tablet is a solid pharmaceutical dosage form."
  }

];


/* =========================================================
   QUIZ STATE
   ========================================================= */

let activeQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;


/* =========================================================
   MAIN TOOL CONTROLLER
   ========================================================= */

function showTool(title, description) {

  if (!results) return;

  if (title.includes("Quizzes")) {

    openQuizMenu();

    return;
  }

  if (title.includes("Calculations")) {

    openCalculations();

    return;
  }

  if (title.includes("Discussions")) {

    openDiscussions();

    return;
  }

  if (title.includes("Progress")) {

    openProgress();

    return;
  }

  if (title.includes("Bookmarks")) {

    openSaved();

    return;
  }

  if (title.includes("Settings")) {

    openSettings();

    return;
  }

  results.innerHTML = `
    <div class="card">
      <h2>${title}</h2>
      <p>${description}</p>
    </div>
  `;

  results.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   QUIZ MENU
   ========================================================= */

function openQuizMenu() {

  const subjects = [
    "Mixed CPH Revision",
    "Pharmacology",
    "Pharmaceutical Calculations",
    "Anatomy & Physiology",
    "Microbiology",
    "Pharmaceutics"
  ];

  results.innerHTML = `
    <div class="card">

      <h2>📝 CPH Quiz Centre</h2>

      <p>
        Test yourself using interactive CPH revision questions.
      </p>

      <label>
        <b>Select subject</b>
      </label>

      <select id="quizSubject"
        style="
          width:100%;
          padding:12px;
          margin:12px 0;
          border-radius:8px;
        ">

        ${subjects.map((subject, i) => `
          <option value="${i}">
            ${subject}
          </option>
        `).join("")}

      </select>

      <button onclick="beginQuiz()">
        🚀 Start Quiz
      </button>

    </div>
  `;

  results.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   START QUIZ
   ========================================================= */

function beginQuiz() {

  const selected =
    Number(document.getElementById("quizSubject").value);

  const subjects = [
    "Mixed CPH Revision",
    "Pharmacology",
    "Pharmaceutical Calculations",
    "Anatomy & Physiology",
    "Microbiology",
    "Pharmaceutics"
  ];

  const subject = subjects[selected];

  if (subject === "Mixed CPH Revision") {

    activeQuestions =
      [...quizQuestions];

  } else {

    activeQuestions =
      quizQuestions.filter(
        q => q.subject === subject
      );

  }

  activeQuestions =
    activeQuestions.sort(
      () => Math.random() - 0.5
    );

  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;

  showQuizQuestion();

}


/* =========================================================
   DISPLAY QUESTION
   ========================================================= */

function showQuizQuestion() {

  if (quizIndex >= activeQuestions.length) {

    finishQuiz();

    return;
  }

  const q =
    activeQuestions[quizIndex];

  quizAnswered = false;

  results.innerHTML = `
    <div class="card">

      <h2>📝 CPH Quiz</h2>

      <p>
        Question ${quizIndex + 1}
        of ${activeQuestions.length}
      </p>

      <hr style="margin:12px 0;">

      <h3>
        ${q.question}
      </h3>

      <div id="quizOptions"
        style="margin-top:15px;">

        ${q.options.map((option, i) => `
          <button
            onclick="answerQuestion(${i})"
            id="option${i}"
            style="
              display:block;
              width:100%;
              text-align:left;
              margin:8px 0;
            "
          >
            ${String.fromCharCode(65 + i)}.
            ${option}
          </button>
        `).join("")}

      </div>

      <div id="quizExplanation"
        style="
          display:none;
          margin-top:15px;
          padding:12px;
          background:#eef6ff;
          border-radius:8px;
        ">
      </div>

      <br>

      <button
        id="nextQuestionButton"
        onclick="nextQuizQuestion()"
        style="display:none;"
      >
        Next Question →
      </button>

    </div>
  `;

  results.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   ANSWER QUESTION
   ========================================================= */

function answerQuestion(selected) {

  if (quizAnswered) return;

  quizAnswered = true;

  const q =
    activeQuestions[quizIndex];

  const buttons =
    document.querySelectorAll(
      "#quizOptions button"
    );

  buttons.forEach(
    (button, index) => {

      button.disabled = true;

      if (index === q.answer) {

        button.style.border =
          "2px solid #198754";

      }

    }
  );

  const selectedButton =
    document.getElementById(
      "option" + selected
    );

  if (selected === q.answer) {

    quizScore++;

    selectedButton.style.border =
      "2px solid #198754";

  } else {

    selectedButton.style.border =
      "2px solid #dc3545";

  }

  const explanation =
    document.getElementById(
      "quizExplanation"
    );

  explanation.innerHTML =
    "<b>Explanation:</b> " +
    q.explanation;

  explanation.style.display =
    "block";

  document.getElementById(
    "nextQuestionButton"
  ).style.display =
    "inline-block";

}


/* =========================================================
   NEXT QUESTION
   ========================================================= */

function nextQuizQuestion() {

  quizIndex++;

  showQuizQuestion();

}


/* =========================================================
   QUIZ RESULTS
   ========================================================= */

function finishQuiz() {

  const total =
    activeQuestions.length;

  const percentage =
    Math.round(
      (quizScore / total) * 100
    );

  saveQuizResult(
    quizScore,
    total,
    percentage
  );

  let message;

  if (percentage >= 80) {

    message =
      "🌟 Excellent performance!";

  } else if (percentage >= 60) {

    message =
      "👍 Good work. Review the questions you missed.";

  } else {

    message =
      "📖 Keep practicing. Review your study materials and try again.";

  }

  results.innerHTML = `
    <div class="card"
      style="text-align:center;">

      <h2>🎉 Quiz Complete</h2>

      <h1 style="font-size:45px;">
        ${percentage}%
      </h1>

      <p>
        You scored
        <b>${quizScore}</b>
        out of
        <b>${total}</b>.
      </p>

      <h3 style="margin:15px 0;">
        ${message}
      </h3>

      <button onclick="openQuizMenu()">
        📝 Try Another Quiz
      </button>

      <button
        onclick="openProgress()"
        style="margin-left:5px;"
      >
        📊 View Progress
      </button>

    </div>
  `;

}


/* =========================================================
   SAVE QUIZ RESULT
   ========================================================= */

function saveQuizResult(
  correct,
  total,
  percentage
) {

  const history =
    JSON.parse(
      localStorage.getItem(
        "cphQuizHistory"
      ) || "[]"
    );

  history.push({

    date:
      new Date().toLocaleString(),

    correct: correct,

    wrong:
      total - correct,

    total: total,

    percentage: percentage

  });

  localStorage.setItem(
    "cphQuizHistory",
    JSON.stringify(history)
  );

}


/* =========================================================
   PROGRESS
   ========================================================= */

function openProgress() {

  const history =
    JSON.parse(
      localStorage.getItem(
        "cphQuizHistory"
      ) || "[]"
    );

  if (history.length === 0) {

    results.innerHTML = `
      <div class="card">

        <h2>📊 Your Progress</h2>

        <p>
          You have not completed a quiz yet.
        </p>

        <br>

        <button onclick="openQuizMenu()">
          📝 Take Your First Quiz
        </button>

      </div>
    `;

    return;
  }

  const latest =
    history[history.length - 1];

  const average =
    Math.round(
      history.reduce(
        (sum, item) =>
          sum + item.percentage,
        0
      ) / history.length
    );

  results.innerHTML = `
    <div class="card">

      <h2>📊 Your Progress</h2>

      <div style="
        display:grid;
        grid-template-columns:
        repeat(auto-fit,minmax(120px,1fr));
        gap:10px;
        margin:15px 0;
      ">

        <div>
          <b>${latest.percentage}%</b>
          <br>
          Latest
        </div>

        <div>
          <b>${average}%</b>
          <br>
          Average
        </div>

        <div>
          <b>${history.length}</b>
          <br>
          Quizzes
        </div>

      </div>

      <h3>Recent Attempts</h3>

      ${history.slice(-5).reverse().map(item => `
        <div style="
          padding:10px 0;
          border-bottom:1px solid #ddd;
        ">
          <b>${item.percentage}%</b>
          —
          ${item.correct}/${item.total}
          correct
          <br>
          <small>${item.date}</small>
        </div>
      `).join("")}

      <br>

      <button onclick="openQuizMenu()">
        📝 Take Another Quiz
      </button>

      <button
        onclick="clearProgress()"
        style="margin-left:5px;"
      >
        🗑️ Clear Progress
      </button>

    </div>
  `;

  results.scrollIntoView({
    behavior:"smooth"
  });

}


function clearProgress() {

  if (
    !confirm(
      "Clear all saved quiz progress on this device?"
    )
  ) return;

  localStorage.removeItem(
    "cphQuizHistory"
  );

  openProgress();

}


/* =========================================================
   PHARMACEUTICAL CALCULATIONS
   ========================================================= */

function openCalculations() {

  results.innerHTML = `
    <div class="card">

      <h2>🧮 Pharmaceutical Calculations</h2>

      <p>
        Practice essential pharmaceutical calculation methods.
      </p>

      <hr style="margin:15px 0;">

      <h3>💧 Dilution</h3>

      <p>
        The common dilution relationship is:
      </p>

      <div style="
        padding:12px;
        background:#eef6ff;
        border-radius:8px;
        margin:10px 0;
        font-weight:bold;
      ">
        C₁V₁ = C₂V₂
      </div>

      <h3>⚖️ Dose Calculation</h3>

      <div style="
        padding:12px;
        background:#eef6ff;
        border-radius:8px;
        margin:10px 0;
      ">
        Volume required =
        Dose required ÷ Dose available
        × Volume containing available dose
      </div>

      <h3>🔢 Percentage Strength</h3>

      <div style="
        padding:12px;
        background:#eef6ff;
        border-radius:8px;
        margin:10px 0;
      ">
        % strength =
        Amount of solute ÷ Amount of preparation × 100
      </div>

      <h3>➗ Allegation</h3>

      <p>
        Allegation is a method for determining the proportions
        of two preparations of different strengths required to
        produce a mixture of an intermediate strength.
      </p>

      <br>

      <button onclick="openCalculationPractice()">
        📝 Practice Calculations
      </button>

    </div>
  `;

}


function openCalculationPractice() {

  results.innerHTML = `
    <div class="card">

      <h2>🧮 Calculation Practice</h2>

      <p>
        A medicine contains 500 mg in 5 mL.
        How many milligrams are contained in 2 mL?
      </p>

      <input
        id="calcAnswer"
        type="number"
        placeholder="Enter your answer in mg"
        style="
          width:100%;
          padding:12px;
          margin:12px 0;
        "
      >

      <button onclick="checkCalculation()">
        Check Answer
      </button>

      <div id="calcResult"
        style="margin-top:15px;">
      </div>

    </div>
  `;

}


function checkCalculation() {

  const answer =
    Number(
      document.getElementById(
        "calcAnswer"
      ).value
    );

  const result =
    document.getElementById(
      "calcResult"
    );

  if (answer === 200) {

    result.innerHTML =
      "✅ Correct! 500 mg ÷ 5 mL = 100 mg/mL; 100 × 2 = 200 mg.";

  } else {

    result.innerHTML =
      "❌ Not quite. First calculate 500 ÷ 5 = 100 mg/mL, then multiply by 2 mL.";

  }

}


/* =========================================================
   DISCUSSIONS
   ========================================================= */

function openDiscussions() {

  results.innerHTML = `
    <div class="card">

      <h2>💬 CPH Discussions</h2>

      <p>
        Ask academic questions and share useful explanations
        with fellow students.
      </p>

      <textarea
        id="discussionText"
        placeholder="Write your question or contribution..."
        style="
          width:100%;
          min-height:110px;
          padding:12px;
          margin:15px 0;
          border-radius:8px;
          border:1px solid #ccc;
        "
      ></textarea>

      <button onclick="postDiscussion()">
        📤 Post
      </button>

      <div id="discussionList"
        style="margin-top:20px;">
      </div>

    </div>
  `;

  loadDiscussions();

}


function postDiscussion() {

  const input =
    document.getElementById(
      "discussionText"
    );

  const text =
    input.value.trim();

  if (!text) {

    alert(
      "Please write something first."
    );

    return;
  }

  const posts =
    JSON.parse(
      localStorage.getItem(
        "cphDiscussions"
      ) || "[]"
    );

  posts.push({

    text: text,

    date:
      new Date().toLocaleString()

  });

  localStorage.setItem(
    "cphDisc
