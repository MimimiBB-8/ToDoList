document.addEventListener("DOMContentLoaded", function () {
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
  let activeTask = [];
  let todoCount = 0,
    doneCount = 0,
    idElem = 0;

  function Task(description, id) {
    this.description = description;
    this.state = false;
    this.id = id;
  }



  function createTemplate(task, index) {
    return `
    <tr class='add_item ${task.state ? 'checked' : ''}' >
    <td>
      <div class='descriptions_wrapper'>
        <input class="btn_state" type="checkbox" id='item_${index}'  ${task.state ? 'checked' : ''}>
        <label class="descriptions">${task.description}</label>
      </div>
      </td>
      <td class='td_button'>
      <button class='btn btn_delete' id='del_item_${index}'>Delete</button>
      </td>
    </tr>  `
  }

  function compliteTask(index) {
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

  function filterTask(parametr) {
    if (parametr == 1) {
      activeTask = task.filter((item) => item.state == false);
    }
    if (parametr == 2) {
      activeTask = task.filter((item) => item.state == true);
    }
    addElement(activeTask)
  }

  function sortTask() {
    task.sort(function (a, b) { return a.state - b.state });
  }

  function addElement(arr) {
    todosWrapper.innerHTML = "";
    if (arr.length > 0) {
      arr.forEach(function (item, index) {
        todosWrapper.innerHTML += createTemplate(item, index);
      })
      todoItems = document.querySelectorAll('.add_item')
    }
  }

  function deleteTask(index) {
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

  deleteAll.addEventListener('click', function () {
    if (confirm("Delete all elements?")) {
      task.length = 0
      addElement(task)
      todoCount = 0
      doneCount = 0;
      countToDo.innerHTML = todoCount;
      countDone.innerHTML = doneCount;
      countAll.innerHTML = task.length;
      localStorage.clear()
    }
  })

  deleteChoose.addEventListener('click', function () {
    let countState = 0;
    if (confirm("Delete selected elements?")) {
      for (let i = 0; i < task.length; i++) {
        if (task[i].state == true) {
          countState++;
        }
      }
      task.length = task.length - countState;
      addElement(task);
      doneCount = 0;
      countDone.innerHTML = doneCount;
      countAll.innerHTML = task.length;

      localStorage.setItem('todo', JSON.stringify(task))
    }

  })

  filterTodo.addEventListener('click', function () {
    filterTask(1)
    // document.querySelector(".todo").classList.toggle("todo-moved")
    filterTodo.classList.add('active')
    filterDone.classList.remove('active')
    filterAll.classList.remove('active')

  })

  filterDone.addEventListener('click', function () {
    filterTask(2)
    // document.querySelector(".todo").classList.toggle("todo-moved");
    filterDone.classList.add('active')
    filterTodo.classList.remove('active')
    filterAll.classList.remove('active')
  })

  filterAll.addEventListener('click', function () {
    addElement(task);
    // document.querySelector(".todo").classList.toggle("todo-moved");
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
            localStorage.setItem('todo', JSON.stringify(task))
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
    if (e.target.classList.value == "descriptions") {
      RowClick(e)
    }

  })

  var lastSelectedRow;
  var trs = document.getElementsByTagName('tr');
  document.onselectstart = function () {
    return false;
  }

  function RowClick(currenttr) {

    if (window.event.ctrlKey) {
      toggleRow(currenttr);
      console.log(currenttr, 'ctrl')
    }

    if (window.event.button === 0) {
      if (!window.event.ctrlKey && !window.event.shiftKey) {
        clearAll();
        toggleRow(currenttr);

        console.log(currenttr, 'ccc', lastSelectedRow)
      }

      if (window.event.shiftKey) {
        selectRowsBetweenIndexes([lastSelectedRow.rowIndex, currenttr.rowIndex])

        console.log(trs, currenttr, 'shift', [lastSelectedRow.rowIndex, currenttr.rowIndex])
      }
    }
  }

  function toggleRow(row) {
    console.log(row, row.className)
    row.className = row.className == 'selected' ? '' : 'selected';
    lastSelectedRow = row;
  }

  function selectRowsBetweenIndexes(indexes) {
    indexes.sort(function (a, b) {
      return a - b;
    });

    for (var i = indexes[0]; i <= indexes[1]; i++) {
      trs[i - 1].className = 'selected';
    }
  }

  function clearAll() {
    for (var i = 0; i < trs.length; i++) {
      trs[i].className = '';
    }
  }


  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  if (storageAvailable('localStorage')) {
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
  }
  else {
    console.log('no')
  }


  document.getElementById('scrollToTop').addEventListener('click', function () {
    window.scrollTo(0, 0);
  })

  document.getElementById('scrollToBottom').addEventListener('click', function () {
    window.scrollTo(0, document.body.scrollHeight);
  })

  addButton.addEventListener('click', function () {
    actionInput();
  })

  addInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      actionInput();
    }
  })

  function actionInput() {
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
});