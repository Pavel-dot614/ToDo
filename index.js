
const newTask = document.getElementById("new");
const add = document.getElementById("add");
const tasksText = document.getElementById("tasks");
const count = document.getElementById("count");
const allCheckBox = document.querySelector('.main-checkbox');
const otherCheckBoxes = document.querySelectorAll('.other-checkbox');
const delAllTasks = document.querySelector('.todo__delete-complete');

const tasks = [];

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '№': '&#8470;',
        '%': '&#37;',
        ':': '&#58;',
        '?': '&#63;',
        '*': '&#42;',
    };
    return text.replace(/[&<>"'№%:?*]/g, function(m) { return map[m]; });
}

function createTask() {
    const newTaskText = escapeHtml(newTask.value.trim());
    if (newTaskText && isValidTask(newTaskText, tasks)) {
        addTask(newTaskText, tasks);
        newTask.value = "";
        tasksRender(tasks);
        allCheckBox.checked = false; 
    }
}

function createTaskOnButton(event) {
    if (event.key === "Enter") {
        createTask();
    }
}

function renderTasksCount(list) {
    count.textContent = list.length;
}

function addTask(text, list) {
    const task = {
        id: Date.now(),
        text,
        isComplete: false,
    };
    list.push(task);

}

function isValidTask(text, list) {
   return !list.some(task => task.text === text)
}

function editTaskText(event) {
    const taskTextElement = event.target;
    const taskElement = taskTextElement.closest('.todo__task');
    const editInputElement = taskElement.querySelector('.todo__edit-input');
    const originalText = taskTextElement.textContent.trim();

    taskTextElement.style.display = 'none';
    editInputElement.style.display = 'block';
    editInputElement.value = originalText;
    editInputElement.focus();

    function saveChanges() {
        const newText = escapeHtml(editInputElement.value.trim());
        if (newText !== "" && newText !== originalText) {
            const taskId = taskElement.id;
            const task = tasks.find(task => task.id === Number(taskId));
            if (task) {
                task.text = newText;
                tasksRender(tasks);
            }
        }

        editInputElement.style.display = 'none';
        taskTextElement.style.display = 'block';
        taskTextElement.textContent = newText !== "" ? newText : originalText;
    }

    editInputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveChanges();
        } else if (event.key === 'Escape') {
            tasksRender(tasks)
        }
    });

    editInputElement.addEventListener('blur', saveChanges);
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
                <div class="todo__task-text">
                    ${task.text}
                </div>
                <input type="text" class="todo__edit-input" style="display: none;">
                <div class="todo__task-del">-</div>
            </div>`;

        listHTML += taskHTML;
    });
    tasksText.innerHTML = listHTML;
    renderTasksCount(list);
    addEditTaskTextListeners()
}

function changeTaskStatus(id, list) {
    const task = list.find(task => task.id === Number(id));
    if (task) {
        task.isComplete = !task.isComplete;
        updateMainCheckboxState();
        tasksRender(list);
    }
}

function updateMainCheckboxState() {
    const allComplete = tasks.length > 0 && tasks.every(task => task.isComplete);
    allCheckBox.checked = allComplete;
}

function checkAllTodo() {
    const allComplete = allCheckBox.checked;

    tasks.forEach(task => {
        if (allComplete) {
            if (!task.isComplete) {
                task.isComplete = true;
            }
        } else {
            if (task.isComplete) {
                task.isComplete = false;
            }
        }
    });

    tasksRender(tasks);
}

function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === Number(id));
    if (index !== -1) {
        tasks.splice(index, 1);
        tasksRender(tasks);
    }
}

function deleteCompletedTasks() {
    const filteredTasks = tasks.filter(task => !task.isComplete);
    tasks.length = 0; 
    tasks.push(...filteredTasks); 
    tasksRender(tasks);
}

function changeOrDel(event) {
    const target = event.target;
    const taskElement = target.closest('.todo__task');
    const taskId = taskElement ? taskElement.id : null;

    if (taskId) {
        switch (true) {
            case target.classList.contains('todo__checkbox-div'):
                changeTaskStatus(taskId, tasks);
                break;
            case target.classList.contains('todo__task-del'):
                deleteTask(taskId);
                break;
        }
    }
}

function addEditTaskTextListeners() {
    document.querySelectorAll('.todo__task-text').forEach(element => {
        element.addEventListener('dblclick', editTaskText);
    });
}

add.addEventListener("click", createTask);
newTask.addEventListener("keydown", createTaskOnButton);
tasksText.addEventListener('click', changeOrDel)
allCheckBox.addEventListener('click', checkAllTodo);
delAllTasks.addEventListener('click', deleteCompletedTasks);


