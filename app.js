function ready() {
  const addInput = document.getElementById('input_task');
  const addButton = document.getElementById('add_task_btn');
  const todosWrapper = document.getElementById('todo_wrapper');
  const todo = document.querySelector('.todo');
  const filterTodo = document.querySelector('.wrapper_count_todo');
  const filterDone = document.querySelector('.wrapper_count_done');
  const filterAll = document.querySelector('.wrapper_count_all');
  const deleteChoose = document.querySelector('.btn_delete_choose');
  const deleteAll = document.querySelector('.btn_delete_all');
  const countDone = document.getElementById('count_done');
  const countToDo = document.getElementById('count_todo');
  const countAll = document.getElementById('count_all')


  let todoItems = [];
  let task = [];
  let todoCount = 0, doneCount = 0;

  function Task(description) {
    this.description = description;
    this.state = false;
  }

  const createTemplate = (task, index) => {
    return `
    <li class='add_item ${task.state ? 'checked' : ''}'>
      <div class='descriptions_wrapper'>
        <input class="btn_state" type="checkbox" id='item_${index}'  ${task.state ? 'checked' : ''}>
        <label for='item_${index}' class="descriptions">${task.description}</label>
      </div>
      <button class='btn btn_delete' id='del_item_${index}'>Delete</button>
    </li>  
  `
  }

  const compliteTask = (index) => {
    task[index].state = !task[index].state;
    if (task[index].state) {
      todoItems[index].classList.add('checked');

      countToDo.innerHTML = '';
      countDone.innerHTML = '';
      todoCount--;
      doneCount++;
      countToDo.innerHTML += todoCount;
      countDone.innerHTML += doneCount;

    }
    else {
      todoItems[index].classList.remove('checked');
      countToDo.innerHTML = '';
      countDone.innerHTML = '';
      todoCount++;
      doneCount--;
      countToDo.innerHTML += todoCount;
      countDone.innerHTML += doneCount;
    }
    sortTask();
    addElement(task);
  }

  const filterTask = (s) => {
    let activeTask = []
    if (s == 1) {
      activeTask = task.filter(item => item.state == false);
    }
    if (s == 2) {
      activeTask = task.filter(item => item.state == true);
    }
    addElement(activeTask)
  }

  const sortTask = () => {
    task.sort((a, b) => { return a.state - b.state });
  }

  const addElement = (arr) => {
    todosWrapper.innerHTML = "";
    if (arr.length > 0) {
      arr.forEach((item, index) => {
        todosWrapper.innerHTML += createTemplate(item, index);
      })
      todoItems = document.querySelectorAll('.add_item')
    }
  }

  const deleteTask = index => {
    if (!task[index].state) {
      countToDo.innerHTML = '';
      todoCount--;
      countToDo.innerHTML += todoCount;
    }
    else {
      countDone.innerHTML = '';
      doneCount--;
      countDone.innerHTML += doneCount;
    }
    task.splice(index, 1);
    countAll.innerHTML = '';
    countAll.innerHTML += task.length;
    addElement(task);
  }

  deleteAll.addEventListener('click', () => {
    if (confirm("Delete all elements?")) {
      task.length = 0
      addElement(task)
      todoCount = 0
      doneCount = 0;
      countToDo.innerHTML = todoCount;
      countDone.innerHTML = doneCount;
      countAll.innerHTML = task.length;
    }
  })

  deleteChoose.addEventListener('click', () => {
    let countState = 0;
    if (confirm("Delete selected elements?")) {
      for (let i = 0; i < task.length; i++) {
        if (task[i].state == true) {
          countState++;
        }
      }
      task.splice(-countState, countState);
      addElement(task);
      doneCount = 0;
      countDone.innerHTML = doneCount;
      countAll.innerHTML = task.length;
    }

  })

  filterTodo.addEventListener('click', () => {
    filterTask(1)
    filterAll.querySelector('h1').style.color = 'black'
    filterTodo.querySelector('h1').style.color = '#DC143C'
    filterDone.querySelector('h1').style.color = 'black'
  })

  filterDone.addEventListener('click', () => {
    filterTask(2)
    filterAll.querySelector('h1').style.color = 'black'
    filterTodo.querySelector('h1').style.color = 'black'
    filterDone.querySelector('h1').style.color = '#DC143C'
  })

  filterAll.addEventListener('click', () => {
    addElement(task);
    filterAll.querySelector('h1').style.color = '#DC143C';
    filterTodo.querySelector('h1').style.color = 'black';
    filterDone.querySelector('h1').style.color = 'black';
  })

  todo.addEventListener('click', function (e) {

    if (e.target.classList.value == "btn_state") {
      if (confirm("Move selected element?")) {
        for (let i = 0; i < task.length; i++) {
          if (e.target.id == "item_" + i) {
            compliteTask(i)
          }
        }
        filterAll.querySelector('h1').style.color = '#DC143C'
        filterTodo.querySelector('h1').style.color = 'black'
        filterDone.querySelector('h1').style.color = 'black'
      }
      else {
        e.preventDefault();
      }
    }
    if (e.target.classList.value == "btn btn_delete") {
      if (confirm("Delete selected element?")) {
        for (let i = 0; i < task.length; i++) {
          if (e.target.id == "del_item_" + i) {
            deleteTask(i)
          }
        }
        filterAll.querySelector('h1').style.color = '#DC143C'
        filterTodo.querySelector('h1').style.color = 'black'
        filterDone.querySelector('h1').style.color = 'black';
      }

    }
  })

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
      countToDo.innerHTML = '';
      task.push(new Task(addInput.value))
      sortTask()
      addElement(task);
      addInput.value = '';
      countAll.innerHTML = '';
      countAll.innerHTML += task.length;
      todoCount++;
      countToDo.innerHTML += todoCount;
    }
    else {
      alert('Please, write your task')
    }

    filterAll.querySelector('h1').style.color = '#DC143C'
    filterTodo.querySelector('h1').style.color = 'black'
    filterDone.querySelector('h1').style.color = 'black'
  }
}

document.addEventListener("DOMContentLoaded", ready);

