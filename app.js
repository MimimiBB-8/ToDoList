const addInput = document.getElementById('input_task');
const addButton = document.getElementById('add_task_btn');
const todosWrapper = document.getElementById('todo_wrapper');
var countTodoTask = 0;

let task = [];
let todoItems = [];
function Task(description) {
  this.description = description;
  this.state = false;
}

const CompliteTask = (index, elem) => {
  task[index].state = !task[index].state;
  if (task[index].state) {
    todoItems[index].classList.add('checked');
  }
  else {
    todoItems[index].classList.remove('checked');
  }
}

const createTemplate = (task, index) => {
  return `
    <div class='row row-justify-content-between align-self-stretch add_item ${task.state ? 'checked' : ''}' id='add_item_id'>
    <div class="col col-1">
    <input class="form-check-input btn_state" type="checkbox" value=""  onclick='CompliteTask(${index})' >
    </div>
    <div class="col col-4">
    <div class="descriptions">${task.description}</div>
    </div>
    <div class="col col-1">
    <button class='btn_delete btn btn-outline-dark' onclick='deleteTask(${index})'>Delete</button>
    </div>
      
    </div>  
  `
}

const addElement = () => {
  todosWrapper.innerHTML = "";
  if (task.length > 0) {
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
  if (addInput.value.length > 0) {
    task.push(new Task(addInput.value));
    addElement();
    addInput.value = '';

  }
  else {
    alert('Please, write your task')
  }
})

