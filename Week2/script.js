const taskInput = document.getElementById("taskInput");
const taskType = document.getElementById("taskType");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const notification = document.getElementById("notification");

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = type;

    setTimeout(() => {
        notification.textContent = "";
        notification.className = "";
    }, 2000);
}

function addTask() {
    const taskText = taskInput.value.trim();
    const category = taskType.value;

    if (taskText === "") {
        showNotification("Task cannot be empty!", "error");
        return;
    }

    const card = document.createElement("div");
    card.classList.add("task-card", category);

    card.innerHTML = `
        <span class="task-text">${taskText}</span>

        <div class="task-actions">

            <button class="icon-btn done-btn" title="Complete">
                <i class="fa-solid fa-check"></i>
            </button>

            <button class="icon-btn edit-btn" title="Edit">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button class="icon-btn delete-btn" title="Delete">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `;

    taskList.appendChild(card);

    const doneBtn = card.querySelector(".done-btn");
    const editBtn = card.querySelector(".edit-btn");
    const deleteBtn = card.querySelector(".delete-btn");
    const taskSpan = card.querySelector(".task-text");

    doneBtn.addEventListener("click", () => {
        card.classList.toggle("completed");

        if (card.classList.contains("completed")) {
            showNotification("Task completed!", "success");
        }
    });

    editBtn.addEventListener("click", () => {
        const updatedTask = prompt("Edit Task:", taskSpan.textContent);

        if (updatedTask === null) return;

        const trimmed = updatedTask.trim();

        if (trimmed === "") {
            showNotification("Task cannot be empty!", "error");
            return;
        }

        taskSpan.textContent = trimmed;
        showNotification("Task updated!", "success");
    });

    deleteBtn.addEventListener("click", () => {
        card.remove();
        showNotification("Task deleted!", "success");
    });

    taskInput.value = "";

    showNotification("Task added!", "success");
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});