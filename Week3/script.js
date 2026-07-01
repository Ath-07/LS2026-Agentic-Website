const goalInput = document.getElementById("goalInput");
const planBtn = document.getElementById("planBtn");
const message = document.getElementById("message");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const goalDisplay = document.getElementById("goalDisplay");
const taskList = document.getElementById("taskList");

let API_KEY = null;

async function loadApiKey() {
  try {
    const res = await fetch(".env");
    const text = await res.text();
    const match = text.match(/GEMINI_API_KEY\s*=\s*(.+)/);
    if (!match) throw new Error("API key not found in .env file");
    API_KEY = match[1].trim();
  } catch {
    showMessage("Failed to load API key. Make sure .env file exists with GEMINI_API_KEY.", "error");
  }
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = type || "";
}

function showLoading(show) {
  loading.classList.toggle("hidden", !show);
  planBtn.disabled = show;
}

function clearTasks() {
  taskList.innerHTML = "";
  result.classList.add("hidden");
}

function displayTasks(goal, tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    showMessage("No tasks were generated. Try a different goal.", "error");
    return;
  }

  goalDisplay.textContent = goal;
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "task-card";

    const priority = task.priority || "Medium";
    const time = task.estimatedTime || "—";

    card.innerHTML = `
      <div class="task-step">${index + 1}</div>
      <div class="task-info">
        <div class="task-name">${escapeHtml(task.taskName)}</div>
        <div class="task-meta">
          <span class="task-priority priority-${priority}">${priority}</span>
          <span class="task-time"><i class="fa-regular fa-clock"></i> ${escapeHtml(time)}</span>
        </div>
      </div>
      <button class="done-btn" title="Mark done">
        <i class="fa-solid fa-check"></i>
      </button>
    `;

    const doneBtn = card.querySelector(".done-btn");
    doneBtn.addEventListener("click", () => {
      card.classList.toggle("completed");
      doneBtn.classList.toggle("completed");
    });

    taskList.appendChild(card);
  });

  result.classList.remove("hidden");
  showMessage("Tasks generated successfully!", "success");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function planGoal() {
  const goal = goalInput.value.trim();

  if (!goal) {
    showMessage("Please enter a goal!", "error");
    return;
  }

  if (!API_KEY) {
    showMessage("API key not loaded. Check .env file.", "error");
    return;
  }

  clearTasks();
  showMessage("", "");
  showLoading(true);

  const prompt = `You are a smart task planner. Given a goal, break it down into a series of tasks.

Return ONLY a valid JSON array. No markdown, no code fences, no extra text. Each object must have:
- "taskName": a clear task description
- "priority": one of "High", "Medium", "Low"
- "estimatedTime": estimated duration (e.g. "30 mins", "2 hours", "1 day")

Goal: ${goal}

JSON array:`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API error: ${res.status}`);
    }

    const data = await res.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini");

    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const tasks = JSON.parse(cleaned);

    displayTasks(goal, tasks);
  } catch (err) {
    showMessage(
      err.message === "Failed to fetch"
        ? "Network error. Check your internet connection."
        : `Error: ${err.message}`,
      "error"
    );
  } finally {
    showLoading(false);
  }
}

planBtn.addEventListener("click", planGoal);

goalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") planGoal();
});

loadApiKey();
