const addInput = document.getElementById('input_task');
const addButton = document.getElementById('add_task_btn');
const todosWrapper = document.getElementById('todo_wrapper');
const todo = document.querySelector('.todo');

let todoItems = [];
let task = [];

function Task(description) {
  this.description = description;
  this.state = false;
}

const createTemplate = (task, index) => {
  return `
    <li class='add_item' onclick='compliteTask(event, ${index})'  ${task.state ? 'checked' : ''}>
    <div class='descriptions_wrapper'>
    <input class="btn_state" type="checkbox" id='item_${index}'  ${task.state ? 'checked' : ''}>
    <label for='item_${index}' class="descriptions">${task.description}</label>
    </div>
    <button class='btn btn_delete ' onclick='deleteTask(${index})'>Delete</button>
    </li>  
  `
}

const compliteTask = (event, index) => {
  if (event.target.nodeName == 'INPUT') {
    task[index].state = !task[index].state;
    if (task[index].state) {
      todoItems[index].classList.add('checked');
    }
    else {
      todoItems[index].classList.remove('checked');
    }
  }
  addElement();
}

const filterTask = () => {
  const activeTask = task.filter(item => item.state == false);
  const doneTask = task.filter(item => item.state == true);
  task = [...activeTask, ...doneTask]
}

const addElement = () => {
  todosWrapper.innerHTML = "";
  if (task.length > 0) {
    filterTask();
    task.forEach((item, index) => {
      todosWrapper.innerHTML += createTemplate(item, index);
    })
    todoItems = document.querySelectorAll('.add_item')
  }

}

const deleteTask = index => {
  task.splice(index, 1);
  addElement();
}

addButton.addEventListener('click', () => {
  actionInput();
})

addInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    actionInput();
  }
})

const actionInput = () => {
  if (addInput.value.length > 0) {
    task.push(new Task(addInput.value));
    addElement();
    addInput.value = '';
  }
  else {
    alert('Please, write your task')
  }
}