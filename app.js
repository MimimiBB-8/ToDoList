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
  const tab = document.querySelector('.tab')


  let todoItems = [];
  let task = [];
  let activeTask = [];
  let todoCount = 0,
    doneCount = 0,
    idElem = 0;

  function Task(description, id) {
    this.description = description;
    this.state = false;
    this.id = id;
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

    } else {
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

  const filterTask = (parametr) => {
    if (parametr == 1) {
      activeTask = task.filter(item => item.state == false);
    }
    if (parametr == 2) {
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
    } else {
      countDone.innerHTML = '';
      doneCount--;
      countDone.innerHTML += doneCount;
    }
    if (filterDone.classList.contains("active")) {
      for (let i = 0; i < task.length; i++) {
        if (activeTask[index] == task[i]) {
          task.splice(i, 1);

        }
      }
    }
    else {
      task.splice(index, 1);
    }
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
      
      localStorage.setItem('todo',JSON.stringify(task))
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
      
      localStorage.setItem('todo',JSON.stringify(task))
    }

  })

  filterTodo.addEventListener('click', () => {
    filterTask(1)
    document.querySelector(".todo").classList.toggle("todo-moved");
    filterTodo.classList.add('active')
    filterDone.classList.remove('active')
    filterAll.classList.remove('active')

  })

  filterDone.addEventListener('click', () => {
    filterTask(2)
    document.querySelector(".todo").classList.toggle("todo-moved");
    filterDone.classList.add('active')
    filterTodo.classList.remove('active')
    filterAll.classList.remove('active')
  })

  filterAll.addEventListener('click', () => {
    addElement(task);
    document.querySelector(".todo").classList.toggle("todo-moved");
    filterAll.classList.add('active')
    filterDone.classList.remove('active')
    filterTodo.classList.remove('active')
  })

  todo.addEventListener('click', function (e) {
    if (e.target.classList.value == "btn_state") {
      if (confirm("Move selected element?")) {
        for (let i = 0; i < task.length; i++) {
          if (e.target.id == "item_" + i) {
            compliteTask(i)
            
      localStorage.setItem('todo',JSON.stringify(task))
          }
        }
      } else {
        e.preventDefault();
      }
    }
    if (e.target.classList.value == "btn btn_delete") {
      if (confirm("Delete selected element?")) {
        for (let i = 0; i < task.length; i++) {
          if (e.target.id == "del_item_" + i) {
            deleteTask(i)

            localStorage.setItem('todo', JSON.stringify(task))
          }
        }
      }

    }
  })

  if (localStorage.getItem('todo')) {
    task = JSON.parse(localStorage.getItem('todo'))
    addElement(task);
    countAll.innerHTML = task.length;
    for (let i = 0; i < task.length; i++) {
      (task[i].state) ? doneCount += 1 : todoCount += 1;
    }
    countToDo.innerHTML = todoCount;
    countDone.innerHTML = doneCount;
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
      countToDo.innerHTML = '';
      idElem += 1;
      task.push(new Task(addInput.value, idElem))
      sortTask()
      addElement(task);
      localStorage.setItem('todo', JSON.stringify(task))
      addInput.value = '';
      countAll.innerHTML = '';
      countAll.innerHTML += task.length;
      todoCount++;
      countToDo.innerHTML += todoCount;
    } else {
      alert('Please, write your task')
    }

  }

}


document.addEventListener("DOMContentLoaded", ready);