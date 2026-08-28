/* CPH STUDY APP */

const results = document.getElementById("results");


/* =========================
   QUIZZES
========================= */

const questions = [
  {
    q: "What is pharmacology?",
    options: [
      "The study of drugs and their effects",
      "The study of bones",
      "The study of food",
      "The study of microorganisms only"
    ],
    answer: 0,
    explanation:
      "Pharmacology is the study of drugs and their effects on living organisms."
  },

  {
    q: "What does pharmacokinetics describe?",
    options: [
      "What the drug does to the body",
      "What the body does to the drug",
      "Only adverse drug reactions",
      "Only drug manufacturing"
    ],
    answer: 1,
    explanation:
      "Pharmacokinetics describes what the body does to a drug: absorption, distribution, metabolism and excretion."
  },

  {
    q: "Which formula is commonly used for dilution calculations?",
    options: [
      "C₁V₁ = C₂V₂",
      "E = mc²",
      "F = ma",
      "P = IV"
    ],
    answer: 0,
    explanation:
      "C₁V₁ = C₂V₂ is commonly used for dilution calculations."
  },

  {
    q: "A medicine contains 500 mg in 5 mL. How many mg are in 1 mL?",
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
    q: "Which organ pumps blood around the body?",
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
    q: "What is homeostasis?",
    options: [
      "Complete absence of change",
      "Maintenance of a relatively stable internal environment",
      "Digestion of food",
      "Movement of bones"
    ],
    answer: 1,
    explanation:
      "Homeostasis is the maintenance of relatively stable internal conditions."
  }
];


let quizIndex = 0;
let quizScore = 0;
let selectedQuestions = [];


/* =========================
   TOOL CONTROLLER
========================= */

function showTool(title, description) {

  if (!results) {
    alert("CPH STUDY app is still loading. Please refresh the page.");
    return;
  }

  if (title.includes("Quizzes")) {
    showQuizMenu();
    return;
  }

  if (title.includes("Calculations")) {
    showCalculations();
    return;
  }

  if (title.includes("Discussions")) {
    showDiscussions();
    return;
  }

  if (title.includes("Progress")) {
    showProgress();
    return;
  }

  if (title.includes("Bookmarks")) {
    showBookmarks();
    return;
  }

  if (title.includes("Settings")) {
    showSettings();
    return;
  }

  results.innerHTML = `
    <div class="card">
      <h2>${title}</h2>
      <p>${description}</p>
    </div>
  `;

  results.scrollIntoView({ behavior: "smooth" });
}


/* =========================
   QUIZ MENU
========================= */

function showQuizMenu() {

  results.innerHTML = `
    <div class="card">

      <h2>📝 CPH STUDY Quiz Centre</h2>

      <p>
        Test your knowledge using CPH revision questions.
      </p>

      <br>

      <button onclick="startQuiz()">
        🚀 Start Mixed Quiz
      </button>

    </div>
  `;

  results.scrollIntoView({
    behavior: "smooth"
  });
}


/* =========================
   START QUIZ
========================= */

function startQuiz() {

  selectedQuestions = [...questions]
    .sort(() => Math.random() - 0.5);

  quizIndex = 0;
  quizScore = 0;

  displayQuestion();
}


/* =========================
   DISPLAY QUESTION
========================= */

function displayQuestion() {

  const question =
    selectedQuestions[quizIndex];

  if (!question) {

    finishQuiz();

    return;
  }

  results.innerHTML = `
    <div class="card">

      <h2>📝 CPH Quiz</h2>

      <p>
        Question ${quizIndex + 1}
        of ${selectedQuestions.length}
      </p>

      <hr>

      <h3 style="margin-top:15px;">
        ${question.q}
      </h3>

      <div style="margin-top:15px;">

        ${question.options.map(
          (option, index) => `
            <button
              onclick="answerQuiz(${index})"
              id="answer-${index}"
              style="
                display:block;
                width:100%;
                text-align:left;
                margin:8px 0;
              "
            >
              ${String.fromCharCode(65 + index)}.
              ${option}
            </button>
          `
        ).join("")}

      </div>

      <div
        id="quizExplanation"
        style="
          display:none;
          margin-top:15px;
          padding:12px;
          background:#eef6ff;
          border-radius:8px;
        "
      ></div>

      <button
        id="nextQuiz"
        onclick="nextQuizQuestion()"
        style="display:none;margin-top:15px;"
      >
        Next Question →
      </button>

    </div>
  `;

  results.scrollIntoView({
    behavior: "smooth"
  });
}


/* =========================
   ANSWER
========================= */

function answerQuiz(selected) {

  const question =
    selectedQuestions[quizIndex];

  const buttons =
    document.querySelectorAll(
      '[id^="answer-"]'
    );

  buttons.forEach(button => {
    button.disabled = true;
  });

  if (selected === question.answer) {

    quizScore++;

    document.getElementById(
      "answer-" + selected
    ).style.border =
      "3px solid green";

  } else {

    document.getElementById(
      "answer-" + selected
    ).style.border =
      "3px solid red";

    document.getElementById(
      "answer-" + question.answer
    ).style.border =
      "3px solid green";
  }

  const explanation =
    document.getElementById(
      "quizExplanation"
    );

  explanation.innerHTML =
    "<b>Explanation:</b> " +
    question.explanation;

  explanation.style.display =
    "block";

  document.getElementById(
    "nextQuiz"
  ).style.display =
    "inline-block";
}


/* =========================
   NEXT QUESTION
========================= */

function nextQuizQuestion() {

  quizIndex++;

  displayQuestion();
}


/* =========================
   FINISH QUIZ
========================= */

function finishQuiz() {

  const total =
    selectedQuestions.length;

  const percentage =
    Math.round(
      (quizScore / total) * 100
    );

  const history =
    JSON.parse(
      localStorage.getItem(
        "cphQuizHistory"
      ) || "[]"
    );

  history.push({
    date: new Date().toLocaleString(),
    correct: quizScore,
    wrong: total - quizScore,
    total: total,
    percentage: percentage
  });

  localStorage.setItem(
    "cphQuizHistory",
    JSON.stringify(history)
  );

  results.innerHTML = `
    <div class="card" style="text-align:center;">

      <h2>🎉 Quiz Complete</h2>

      <div style="
        font-size:45px;
        font-weight:bold;
        margin:15px;
      ">
        ${percentage}%
      </div>

      <p>
        You scored
        <b>${quizScore}</b>
        out of
        <b>${total}</b>.
      </p>

      <br>

      <button onclick="showQuizMenu()">
        📝 Try Again
      </button>

      <button onclick="showProgress()">
        📊 View Progress
      </button>

    </div>
  `;

}


/* =========================
   CALCULATIONS
========================= */

function showCalculations() {

  results.innerHTML = `
    <div class="card">

      <h2>🧮 Pharmaceutical Calculations</h2>

      <p>
        Practice pharmaceutical calculations.
      </p>

      <hr style="margin:15px 0;">

      <h3>💧 Dilution</h3>

      <p>
        C₁V₁ = C₂V₂
      </p>

      <br>

      <h3>⚖️ Dose Calculation</h3>

      <p>
        Volume required =
        Dose required ÷ Dose available
        × Volume containing available dose.
      </p>

      <br>

      <h3>➗ Allegation</h3>

      <p>
        Allegation is a method used to determine the
        proportions of two preparations of different
        strengths needed to obtain a mixture of a desired
        intermediate strength.
      </p>

      <br>

      <button onclick="calculationQuestion()">
        📝 Practice Question
      </button>

    </div>
  `;

  results.scrollIntoView({
    behavior: "smooth"
  });
}


function calculationQuestion() {

  results.innerHTML = `
    <div class="card">

      <h2>🧮 Practice Question</h2>

      <p>
        A solution contains 500 mg in 5 mL.
        How many milligrams are contained in 2 mL?
      </p>

      <input
        id="calcAnswer"
        type="number"
        placeholder="Enter answer in mg"
        style="
          width:100%;
          padding:12px;
          margin:15px 0;
        "
      >

      <button onclick="checkCalculation()">
        Check Answer
      </button>

      <div
        id="calculationResult"
        style="margin-top:15px;"
      ></div>

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
      "calculationResult"
    );

  if (answer === 200) {

    result.innerHTML =
      "✅ Correct! 500 ÷ 5 = 100 mg/mL, therefore 100 × 2 = 200 mg.";

  } else {

    result.innerHTML =
      "❌ Try again. First calculate the amount per mL.";
  }

}


/* =========================
   DISCUSSIONS
========================= */

function showDiscussions() {

  results.innerHTML = `
    <div class="card">

      <h2>💬 Discussions</h2>

      <p>
        Write an academic question or share a useful
        explanation with other students.
      </p>

      <textarea
        id="discussionInput"
        placeholder="Write your question..."
        style="
          width:100%;
          min-height:120px;
          margin:15px 0;
          padding:12px;
          border-radius:8px;
        "
      ></textarea>

      <button onclick="postDiscussion()">
        📤 Post
      </button>

      <div
        id="discussionPosts"
        style="margin-top:20px;"
      ></div>

    </div>
  `;

  loadDiscussions();

}


function postDiscussion() {

  const input =
    document.getElementById(
      "discussionInput"
    );

  const text =
    input.value.trim();

  if (!text) {

    alert(
      "Please write a question first."
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
    date: new Date().toLocaleString()
  });

  localStorage.setItem(
    "cphDiscussions",
    JSON.stringify(posts)
  );

  input.value = "";

  loadDiscussions();

}


function loadDiscussions() {

  const container =
    document.getElementById(
      "discussionPosts"
    );

  if (!container) return;

  const posts =
    JSON.parse(
      localStorage.getItem(
        "cphDiscussions"
      ) || "[]"
    );

  if (!posts.length) {

    container.innerHTML =
      "<p>No discussions yet.</p>";

    return;
  }

  container.innerHTML =
    posts.reverse().map(
      post => `
        <div style="
          background:#f5f7fa;
          padding:12px;
          margin-bottom:10px;
          border-radius:8px;
        ">
          <p>${escapeHTML(post.text)}</p>
          <small>${post.date}</small>
        </div>
      `
    ).join("");

}


/* =========================
   PROGRESS
========================= */

function showProgress() {

  const history =
    JSON.parse(
      localStorage.getItem(
        "cphQuizHistory"
      ) || "[]"
    );

  if (!history.length) {

    results.innerHTML = `
      <div class="card">
        <h2>📊 Progress</h2>
        <p>No quiz attempts yet.</p>

        <br>

        <button onclick="showQuizMenu()">
          📝 Take a Quiz
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

      <h3>
        Latest Score:
        ${latest.percentage}%
      </h3>

      <p>
        Average Score:
        <b>${average}%</b>
      </p>

      <p>
        Quizzes Completed:
        <b>${history.length}</b>
      </p>

      <hr style="margin:15px 0;">

      <h3>Recent Attempts</h3>

      ${history.slice(-5).reverse().map(item => `
        <p style="margin:10px 0;">
          <b>${item.percentage}%</b>
          — ${item.correct}/${item.total}
          correct
          <br>
          <small>${item.date}</small>
        </p>
      `).join("")}

      <br>

      <button onclick="showQuizMenu()">
        📝 Take Quiz
      </button>

    </div>
  `;

}


/* =========================
   BOOKMARKS
========================= */

function showBookmarks() {

  results.innerHTML = `
    <div class="card">

      <h2>🔖 Saved Materials</h2>

      <p>
        Your saved learning materials will appear here.
      </p>

    </div>
  `;

}


/* =========================
   SETTINGS
========================= */

function showSettings() {

  results.innerHTML = `
    <div class="card">

      <h2>⚙️ Settings</h2>

      <p>
        CPH STUDY settings.
      </p>

      <br>

      <button onclick="toggleDarkMode()">
        🌙 Toggle Dark Mode
      </button>

      <button onclick="requestNotifications()">
        🔔 Notifications
      </button>

    </div>
  `;

}


function toggleDarkMode() {

  document.body.classList.toggle(
    "dark-mode"
  );

}


function requestNotifications() {

  if (!("Notification" in window)) {

    alert(
      "Notifications are not supported by this browser."
    );

    return;
  }

  Notification.requestPermission()
    .then(permission => {

      if (permission === "granted") {

        alert(
          "🔔 Notifications enabled."
        );

      }

    });

}


/* =========================
   SAFE TEXT
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* =========================
   DAILY QUOTE
========================= */

const dailyQuotes = [
  "Study today. Become better tomorrow.",
  "Understand the concept, then memorize the details.",
  "Consistency creates academic excellence.",
  "Every question is an opportunity to learn.",
  "Learn • Practice • Master."
];

const quote =
  document.getElementById("quote");

if (quote) {

  const day =
    Math.floor(
      Date.now() / 86400000
    );

  quote.textContent =
    "💡 " +
    dailyQuotes[
      day % dailyQuotes.length
    ];

}
