const dom = {
  new: document.getElementById("new"),
  add: document.getElementById("add"),
  tasks: document.getElementById("tasks"),
  count: document.getElementById("count"),
};

const tasks = [];

function createTask() {
  const newTaskText = dom.new.value;
  if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
    addTask(newTaskText, tasks);
    dom.new.value = "";
    tasksRender(tasks);
  }
}

function renderTasksCount(list) {
  dom.count.innerHTML = list.length;
}

dom.add.addEventListener("click", createTask);

function createTaskOnButton(event) {
  const newTaskText = dom.new.value;
  if (
    event.key === "Enter" &&
    isNotHaveTask(newTaskText, tasks) &&
    newTaskText
  ) {
    addTask(newTaskText, tasks);
    dom.new.value = "";
    tasksRender(tasks);
  }
}

document.addEventListener("keydown", createTaskOnButton);

function addTask(text, list) {
  const task = {
    id: Date.now(),
    text,
    isComplete: false,
  };
  list.push(task);
  console.log(tasks);
}

function isNotHaveTask(text, list) {
  let isNotHave = true;
  list.forEach((task) => {
    if (task.text === text) {
      alert("Задача уже существует");
      isNotHave = false;
    }
  });
  return isNotHave;
}

function tasksRender(list) {
  let listHTML = "";

  list.forEach((task) => {
    const cls = task.isComplete
      ? "todo__task todo__task_complete"
      : "todo__task";
    const checked = task.isComplete ? "checked" : "";
    const taskHTML = `
    <div id='${task.id}' class="${cls}">
                    <label class="todo__checkbox"> 
                     <input type="checkbox" ${checked}>
                     <div class="todo__checkbox-div"></div>
                 </label>
                 <div class="todo__task-text">${task.text}</div>
                 <div class="todo__task-del">-</div>
                 </div>`;

    listHTML += taskHTML;
  });
  dom.tasks.innerHTML = listHTML;

  renderTasksCount(list);
}

function changeTaskStatus(id, list) {
  list.forEach((task) => {
    if (task.id === Number(id)) {
      task.isComplete = !task.isComplete;
    }
  });
}

function toggleStatus(event) {
  const target = event.target;
  const isCheckboxEl = target.classList.contains("todo__checkbox-div");
  const isDeleteEl = target.classList.contains("todo__task-del");
  if (isCheckboxEl) {
    const task = target.parentElement.parentElement;
    const taskId = task.getAttribute("id");
    changeTaskStatus(taskId, tasks);
    tasksRender(tasks);
  }
  if (isDeleteEl) {
    const task = target.parentElement;
    const taskId = task.getAttribute("id");
    deleteTask(taskId, tasks);
    tasksRender(tasks);
  }
}

dom.tasks.addEventListener("click", toggleStatus);

function deleteTask(id, list) {
  list.forEach((task, idx) => {
    if (task.id == id) {
      list.splice(idx, 1);
    }
  });
}

// const del = document.querySelector("todo__task-del");
// del.parentElement.addEventListener("click", deleteTask);
