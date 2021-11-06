const addInput = document.getElementById('input_task');
const addButton = document.getElementById('add_task_btn');
const todosWrapper = document.querySelector('.todos_wrapper');

let task = [];

function Task(description) {
  this.description = description;
  this.state = false;
}

const createTemplate = (task, index) => {
  return `
    <div class='add_item'>
      <input type="checkbox" class='btn_state'>
      <div class="descriptions">${task.description}</div>
      <button class='btn_delete'>Delete</button>
    </div>  
  `
}

const addDivHtml = () => {
  todosWrapper.innerHTML = "";
  if (task.length > 0) {
    task.forEach((item, index) => {
      todosWrapper.innerHTML += createTemplate(item, index);
    })
  }

  
}

addButton.addEventListener('click', () => {
  task.push(new Task(addInput.value));
  addDivHtml();
})