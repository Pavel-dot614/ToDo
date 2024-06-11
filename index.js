const dom = {
    new:document.getElementById('new'),
    add:document.getElementById('add'),
    tasks:document.getElementById('tasks')
}

const tasks = [];

dom.add.onclick = () =>{
    const newTaskText = dom.new.value;
   if(newTaskText && isNotHaveTask(newTaskText, tasks)){
    addTask(newTaskText, tasks)
    dom.new.value = '';
    tasksRender(tasks)
   }
}

document.addEventListener('keydown', (event) => {
    const newTaskText = dom.new.value;
    if(event.key === 'Enter' && isNotHaveTask(newTaskText, tasks) && newTaskText){
        addTask(newTaskText, tasks)
    dom.new.value = '';
    tasksRender(tasks)
    }
})

function addTask(text, list){
    const task = {
        id: Date.now(),
        text,
        isComplete: false
    }
    list.push(task);
    console.log(tasks)
}



function isNotHaveTask(text, list){
    let isNotHave = true;
    list.forEach((task) => {
    if (task.text === text){
        alert('Задача уже существует')
        isNotHave = false;
    }
 });
 return isNotHave;
}



function tasksRender(list){
  let listHTML = '';

  list.forEach((task) => {
    const cls = task.isComplete 
    ? 'todo__task todo__task_complete' 
    : 'todo__task';
    const checked = task.isComplete ? 'checked' : '';
    const taskHTML = `
    <div id='${task.id}' class="${cls}">
                    <label class="todo__checkbox"> 
                     <input type="checkbox" ${checked}>
                     <div class="todo__checkbox-div"></div>
                 </label>
                 <div class="todo__task-text">${task.text}</div>
                 <div class="todo__task-del">-</div>
                 </div>`

    listHTML += taskHTML;
  });
 dom.tasks.innerHTML = listHTML;
}


dom.tasks.onclick = (event) => {
    const target = event.target;
    const isCheckboxEl = target.classList.contains('todo__checkbox-div');
    if(isCheckboxEl){ 
      const task = target.parentElement.parentElement;
      const taskId = task.getAttribute('id');
      changeTaskStatus(taskId, tasks);
      tasksRender(tasks)
    }
}

function changeTaskStatus(id, list){
list.forEach((task) => {
    if(task.id === Number(id)){
        task.isComplete = !task.isComplete
    }
})
}
