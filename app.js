const addInput = document.getElementById('input_task');
const addButton = document.getElementById('add_task_btn');
const todosWrapper = document.getElementById('todo_wrapper');
const todosWrapperCompplite = document.getElementById('todo_wrapper_complite');

let task = [];
let todoItems = [];
function Task(description) {
  this.description = description;
  this.state = false;
}

const CompliteTask = index => {
  task[index].state = !task[index].state;
  if (task[index].state) {
    todoItems[index].classList.add('checked');
    moveElement(todosWrapperCompplite);
  }
  else {
    todoItems[index].classList.remove('checked');
    moveElement(todosWrapper);
  }
}

const moveElement = (neededDiv) => {
  neededDiv.appendChild(document.getElementById('add_item_id'));
}

const createTemplate = (task, index) => {
  return `
    <div class='add_item ${task.state ? 'checked' : ''}' id='add_item_id'>
      <input type="checkbox" onclick='CompliteTask(${index})' class='btn_state' ${task.state ? 'checked' : ''}>
      <div class="descriptions">${task.description}</div>
      <button class='btn_delete' onclick='deleteTask(${index})'>Delete</button>
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

