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
    const filterButtons = document.querySelectorAll('.todo__buttons .button');
    const toDoButtons = document.querySelector('.todo__buttons');

    const tasks = [];
    let filterType = "all";
    let currentPage = 1;
    const tasksPerPage = 5;
    let escapePressed = false;

    // GET /tasks
    async function loadTasks() {
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                mode: 'cors',
                method: 'GET'
            });
            const data = await response.json();
            data.map(task => tasks.push(task));
            tasksRender(tasks);
        } catch (error) {
            console.log(error, 'Ошибка загрузки');
        }
    }

    // POST /tasks
    async function createTask() {
        const newTaskText = newTask.value.trim();
        if (newTaskText && isValidTask(newTaskText, tasks)) {
            await addTask(newTaskText);
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

    async function addTask(text) {
        const task = {
            text
        };
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task),
            });
            const data = await response.json();
            tasks.push(data);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    function isValidTask(text, list) {
        return !list.some(task => task.text === text)
    }

     function editTaskText(event) {
        const taskTextElement = event.target;
        const taskElement = taskTextElement.closest('.todo__task');
        const taskId = parseInt(taskElement.id, 10);

        const editInputElement = document.createElement('input');
        editInputElement.type = 'text';
        editInputElement.maxLength = '20';
        editInputElement.className = 'todo__edit-input';

        const originalText = taskTextElement.textContent.trim();
        taskTextElement.style.display = 'none';
        editInputElement.value = originalText;
        taskElement.insertBefore(editInputElement, taskTextElement);
        editInputElement.focus();

        addEventListenersForEdit(editInputElement, taskTextElement, originalText, taskId);
    }

    function addEventListenersForEdit(editInputElement, taskTextElement, originalText, taskId) {
        editInputElement.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                await saveTaskText(editInputElement, taskId);
                editInputElement.remove();
                taskTextElement.style.display = 'block';
            } else if (event.key === 'Escape') {
                escapePressed = true;
                editInputElement.remove();
                taskTextElement.style.display = 'block';
                tasksRender(tasks);
            }
        });

        editInputElement.addEventListener('blur', async () => {
            if (!escapePressed) {
                await saveTaskText(editInputElement, taskId);
            }
            editInputElement.remove();
            taskTextElement.style.display = 'block';
            escapePressed = false;
            tasksRender(tasks);
        });
    }

    async function saveTaskText(input, taskId) {
        const newText = input.value;
        const task = tasks.find(task => task.id === taskId);

        if (task && task.text !== newText) {
            task.text = newText;

            try {
                const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: newText })
                });
                if (!response.ok) {
                    console.error('Error updating task:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    }

  
    async function tasksRender(list) {
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
                    ${_.escape(task.text)}
                </div>
                <div class="todo__task-del">-</div>
            </div>`;

            listHTML += taskHTML;
        });
        tasksText.innerHTML = listHTML;
        renderTasksCount(list);
        addEditTaskTextListeners();
        updatePaginationControls(filteredTasks.length);
        updateFilterButtons();
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

            try {
                fetch(`http://localhost:3000/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ isComplete: task.isComplete })
                });
            } catch (error) {
                console.error('Ошибка обновления статуса', error);
            }
        }
    }

    function checkAllTodo() {
        const allComplete = allCheckBox.checked;

        tasks.forEach(task => {
            task.isComplete = allComplete;

            try {
                fetch(`http://localhost:3000/tasks/${task.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ isComplete: task.isComplete })
                });
            } catch (error) {
                console.error('Ошибка обновления всех статусов', error);
            }
        });

        tasksRender(tasks);
    }

    function updateCheckAllStatus() {
        allCheckBox.checked = tasks.length > 0 && tasks.every(task => task.isComplete);
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const index = tasks.findIndex(task => task.id === Number(id));
                if (index !== -1) {
                    tasks.splice(index, 1);
                    const totalPages = Math.ceil(tasks.length / tasksPerPage);
                    if (currentPage > totalPages) {
                        currentPage = totalPages;
                    }
                }
                tasksRender(tasks);
            }
        } catch (error) {
            console.error('Ошибка удаления', error);
        }
        updateCheckAllStatus();
    }

    async function deleteCompletedTasks() {
        const completedTasks = tasks.filter(task => task.isComplete);
        for (const task of completedTasks) {
            await deleteTask(task.id);
        }
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
        filterType = type;
        if (filterType === 'completed' || filterType === 'active') {
            currentPage = 1
        }
        tasksRender(tasks);
    }

    function updateFilterButtons() {
        filterButtons.forEach(button => {
            button.classList.remove('active');
        });

        switch (filterType) {
            case 'all':
                document.querySelector('.button[data-filter="all"]').classList.add('active');
                break;
            case 'active':
                document.querySelector('.button[data-filter="active"]').classList.add('active');
                break;
            case 'completed':
                document.querySelector('.button[data-filter="completed"]').classList.add('active');
                break;
        }
    }

    function setDataFilter(event) {
        if (event.target.classList.contains('button')) {
            const filter = event.target.getAttribute('data-filter');
            setFilter(filter);
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
    allCompleteTasks.addEventListener("click", () => setFilter("all"));
    activeTask.addEventListener("click", () => setFilter("active"));
    completedTask.addEventListener("click", () => setFilter("completed"));
    paginationContainer.addEventListener('click', changePage);
    toDoButtons.addEventListener('click', setDataFilter);
    loadTasks()
})();
