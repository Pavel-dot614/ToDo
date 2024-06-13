
const newTask = document.getElementById("new");
const add = document.getElementById("add");
const tasksText = document.getElementById("tasks");
const count = document.getElementById("count");
const allCheckBox = document.querySelector('.main-checkbox');
const otherCheckBoxes = document.querySelectorAll('.other-checkbox')
const delAllTasks = document.querySelector('.todo__delete-complete')

const tasks = [];

function createTask() {
    const newTaskText = newTask.value.trim();
    if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
        addTask(newTaskText, tasks);
        newTask.value = "";
        tasksRender(tasks);
    }
}

function renderTasksCount(list) {
    count.innerHTML = list.length;
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

}


function deleteTask(id, list) {
    list.forEach((task, idx) => {
        if (task.id == id) {
            list.splice(idx, 1);
        }
    });
}

// function deleteCompletedTasks(list) {
//     list.forEach((task, ind) => {
//         if (task.isComplete = true) {
//             list.splice(task.filter(item) => );
//         }
//     })
// }
// delAllTasks.addEventListener('click', deleteCompletedTasks(this.isComplete, tasks))
add.addEventListener("click", createTask);
tasksText.addEventListener("click", toggleStatus);
document.addEventListener("keydown", createTaskOnButton);


allCheckBox.addEventListener('click', toggleStatus)


