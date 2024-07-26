
(() => {
    const newTask = document.getElementById("new");
    const add = document.getElementById("add");
    const tasksText = document.getElementById("tasks");
    const count = document.getElementById("count");
    const allCheckBox = document.querySelector('.main-checkbox');
    const delAllTasks = document.querySelector('.todo__delete-complete');
    const allCompleteTasks = document.getElementById('btn-all');
    const activeTask = document.getElementById('btn-active');
    const completedTask = document.getElementById('btn-completed');
    const paginationContainer = document.querySelector('.pagination');


    const tasks = [];
    let filterType = "all";
    let currentPage = 1;
    const tasksPerPage = 5;
    let escapePressed = false;



    function createTask() {
        const newTaskText = _.escape(newTask.value.trim());
        if (newTaskText && isValidTask(newTaskText, tasks)) {
            addTask(newTaskText, tasks);
            newTask.value = "";
            tasksRender(tasks);
            allCheckBox.checked = false;
        }
        goToLastPage()
    }

    function createTaskOnButton(event) {
        if (event.key === "Enter") {
            createTask();
        }
    }

    function renderTasksCount(list) {
        count.textContent = list.length;
        const completedCount = list.filter(task => task.isComplete).length;
        const incompleteCount = list.filter(task => !task.isComplete).length;
        allCompleteTasks.textContent = `All (${list.length})`;
        activeTask.textContent = `Active (${incompleteCount})`;
        completedTask.textContent = `Completed (${completedCount})`;
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
    const editInputElement = document.createElement('input');
    editInputElement.type = 'text';
    editInputElement.maxLength = '20'
    editInputElement.className = `${taskTextElement.parentElement.id}__todo__edit-input todo__edit-input`;

    const originalText = taskTextElement.textContent.trim();
    taskTextElement.style.display = 'none';
    editInputElement.value = originalText;
    taskElement.insertBefore(editInputElement, taskTextElement);
    editInputElement.focus();
    addEventListenersForEdit(editInputElement, taskElement, taskTextElement, originalText);
}

function addEventListenersForEdit(editInputElement, taskElement, taskTextElement, originalText) {
    const input = document.querySelector('.todo__edit-input');
    const taskId = parseInt(input.className, 10);

    editInputElement.addEventListener('keydown', (event) => handleEditKeyDown(event, input, taskId));
    editInputElement.addEventListener('blur', () => handleBlur(input, taskId));
}

function handleEditKeyDown(event, input, taskId) {
    switch (event.key) {
        case 'Enter':
            saveTaskText(input, taskId);
            input.blur();
            break;
        case 'Escape':
            escapePressed = true;
            input.remove();
            tasksRender(tasks);
            break;
    }
}

function handleBlur(input, taskId) {
    if (!escapePressed) {
        saveTaskText(input, taskId);
    }
    escapePressed = false;  
    tasksRender(tasks);
}

function saveTaskText(input, taskId) {
    tasks.forEach((item) => {
        if (item.id === taskId) {
            item.text = input.value;
        }
    });
}

    function tasksRender(list) {
        let filteredTasks = list;
        switch (filterType) {
            case 'active':
                filteredTasks = list.filter(task => !task.isComplete);
                break;
            case 'completed':
                filteredTasks = list.filter(task => task.isComplete);
                break;
        }


        const start = (currentPage - 1) * tasksPerPage;
        const end = start + tasksPerPage;
        const tasksToDisplay = filteredTasks.slice(start, end);

        let listHTML = "";
        tasksToDisplay.forEach((task) => {
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
                <div class="todo__task-del">-</div>
            </div>`;

            listHTML += taskHTML;
        });
        tasksText.innerHTML = listHTML;
        renderTasksCount(list);
        addEditTaskTextListeners();
        updatePaginationControls(filteredTasks.length);
    }

    function updatePaginationControls(totalTasks) {
        const totalPages = Math.ceil(totalTasks / tasksPerPage);

        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.textContent = i;
            pageNumber.classList.add('page-number');
            if (i === currentPage) {
                pageNumber.classList.add('active');
            }
            paginationContainer.appendChild(pageNumber);
        }
    }

    function changePage(event) {
        const target = event.target;
        if (target.classList.contains('page-number')) {
            const page = Number(target.textContent);
            goToPage(page);
        }
    }

    function goToPage(page) {
        currentPage = page;
        tasksRender(tasks);
    }

    function goToLastPage() {
        const totalTasks = tasks.length;
        const totalPages = Math.ceil(totalTasks / tasksPerPage);
        currentPage = totalPages;
        tasksRender(tasks);
    }

    function changeTaskStatus(id, list) {
        const task = list.find(task => task.id === Number(id));
        if (task) {
            task.isComplete = !task.isComplete;
            const allComplete = tasks.length > 0 && tasks.every(task => task.isComplete);
            allCheckBox.checked = allComplete;
            tasksRender(list);
        }
    }

    function checkAllTodo() {
        const allComplete = allCheckBox.checked;

        tasks.forEach(task => {
            task.isComplete = allComplete;
        });

        tasksRender(tasks);
    }

    function updateCheckAllStatus() {
        allCheckBox.checked = tasks.length > 0 && tasks.every(task => task.isComplete);
    }
    
    function deleteTask(id) {
        const index = tasks.findIndex(task => task.id === Number(id));
        if (index !== -1) {
            tasks.splice(index, 1);
            const totalPages = Math.ceil(tasks.length / tasksPerPage);
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }
            tasksRender(tasks);
            updateCheckAllStatus()
        }
    }


    function deleteCompletedTasks() {
        const filteredTasks = tasks.filter(task => !task.isComplete);
        tasks.length = 0;
        tasks.push(...filteredTasks);
        tasksRender(tasks);
        updateCheckAllStatus()
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

    function setFilter(type) {
        switch (type) {
            case 'all':
                filterType = 'all';
                break;
            case 'active':
                filterType = 'active';
                break;
            case 'completed':
                filterType = 'completed';
                break;

        }

        tasksRender(tasks);
        updateFilterButtons();
    }

    document.querySelector('.todo__buttons').addEventListener("click", (event) => {
        if (event.target.classList.contains('button')) {
            setFilter(event.target.textContent.toLowerCase());
        }
    });
    
    function updateFilterButtons() {
        filterButtons.forEach(button => {
            if (button.textContent.toLowerCase() === filterType) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
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
    allCompleteTasks.addEventListener("click", () => setFilter("all"));
    activeTask.addEventListener("click", () => setFilter("active"));
    completedTask.addEventListener("click", () => setFilter("completed"));
    paginationContainer.addEventListener('click', changePage);
    updateFilterButtons()
})();
