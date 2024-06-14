
const newTask = document.getElementById("new");
const add = document.getElementById("add");
const tasksText = document.getElementById("tasks");
const count = document.getElementById("count");
const allCheckBox = document.querySelector('.main-checkbox');
const otherCheckBoxes = document.querySelectorAll('.other-checkbox');
const delAllTasks = document.querySelector('.todo__delete-complete');

const tasks = [];

function createTask() {
    const newTaskText = newTask.value.trim();
    if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
        addTask(newTaskText, tasks);
        newTask.value = "";
        tasksRender(tasks);
    }
}

function createTaskOnButton(event) {
    const newTaskText = newTask.value.trim();
    if (
        event.key === "Enter" &&
        isNotHaveTask(newTaskText, tasks) &&
        newTaskText
    ) {
        addTask(newTaskText, tasks);
        newTask.value = "";
        tasksRender(tasks);
    }
}

function renderTasksCount(list) {
    count.innerHTML = list.length;
}


function addTask(text, list) {
    const task = {
        id: Date.now(),
        text,
        isComplete: false,
    };
    list.push(task);

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
                     <input type="checkbox" ${checked} class="other-checkbox">
                     <div class="todo__checkbox-div"></div>
                 </label>
                 <div class="todo__task-text">${task.text}</div>
                 <div class="todo__task-del">-</div>
                 </div>`;

        listHTML += taskHTML;
    });
    tasksText.innerHTML = listHTML;


    renderTasksCount(list);
}

function changeTaskStatus(id, list) {
    list.forEach((task) => {
        if (task.id === Number(id)) {
            task.isComplete = !task.isComplete;
        }
    });
}

function checkAllTodo(list) {
    list.forEach((task) => {
            task.isComplete = !task.isComplete
    })

};

function toggleStatus(event) {
    const target = event.target;
    const isCheckboxEl = target.classList.contains("todo__checkbox-div");
    const isDeleteEl = target.classList.contains("todo__task-del");
    const isMainCheckbox = target.classList.contains('main-checkbox');
    const isAllDelTasks = target.classList.contains('del-all-task');
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
    if (isMainCheckbox) {
        // const task = target.parentElement.parentElement;
        // const taskId = task.getAttribute("id");
        checkAllTodo(tasks);
        tasksRender(tasks);
    }
    if (isAllDelTasks) {
        delAllCheckedTask(tasks);
        tasksRender(tasks);
    }

}


function deleteTask(id, list) {
    list.forEach((task, idx) => {
        if (task.id == id) {
            list.splice(idx, 1);
        }
    });
}

function delAllCheckedTask(appendBox) {
    const items = document.getElementById(appendBox).querySelectorAll('.todo__task todo__task_complete');
    items.forEach(item => item.closest('.todo__task todo__task_complete').remove());
    console.log('qq')
}

// let task = document.createElement('span');
// 		task.classList.add('task');
// 		task.textContent = this.value;
// 		task.addEventListener('dblclick', function() {
// 			let text = this.textContent;
// 			this.textContent = '';

delAllTasks.addEventListener('click', toggleStatus)
add.addEventListener("click", createTask);
tasksText.addEventListener("click", toggleStatus);
document.addEventListener("keydown", createTaskOnButton);
tasksText.addEventListener('dblclick', function () {
    console.log('dblclick')
})

allCheckBox.addEventListener('click', toggleStatus)


