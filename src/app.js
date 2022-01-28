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
    <li class='add_item ${task.state ? 'checked' : ''}' id='add_item_${index}'>
      <div class='descriptions_wrapper'>
        <input class="btn_state" type="checkbox" id='item_${index}'  ${task.state ? 'checked' : ''}>
        <label class="descriptions">${task.description}</label>
      </div>
      <div class='li_button'>
      <button class='btn btn_delete' id='del_item_${index}'>Delete</button>
      </div>
    </li>  `
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
    if (parametr == 'do') {
      activeTask = task.filter((item) => item.state == false);
    }
    if (parametr == 'done') {
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
      if (storageAvailable('localStorage')) {
        localStorage.clear()
      }
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
      task.splice(-countState, countState)
      addElement(task);
      doneCount = 0;
      countDone.innerHTML = doneCount;
      countAll.innerHTML = task.length;
      if (storageAvailable('localStorage')) {
        localStorage.setItem('todo', JSON.stringify(task))
      }

    }

  })

  filterTodo.addEventListener('click', function () {
    filterTask('do')
    filterTodo.classList.add('active')
    filterDone.classList.remove('active')
    filterAll.classList.remove('active')

  })

  filterDone.addEventListener('click', function () {
    filterTask('done')
    filterDone.classList.add('active')
    filterTodo.classList.remove('active')
    filterAll.classList.remove('active')
  })

  filterAll.addEventListener('click', function () {
    addElement(task);
    filterAll.classList.add('active')
    filterDone.classList.remove('active')
    filterTodo.classList.remove('active')
  })

  const ul = document.getElementsByTagName('ul')[0];
  var lastClickedLi = null;

  todo.addEventListener('click', function (e) {
    if (e.target.classList.value == "btn_state") {
      if (confirm("Move selected element?")) {
        for (let i = 0; i < task.length; i++) {
          if (e.target.id == "item_" + i) {
            compliteTask(i)
            if (storageAvailable('localStorage')) {
              localStorage.setItem('todo', JSON.stringify(task))
            }
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
            if (storageAvailable('localStorage')) {
              localStorage.setItem('todo', JSON.stringify(task))
            }
          }
        }
      }
    }
    if (e.target.classList.value == 'descriptions') {
      if (e.ctrlKey) {
        e.target.closest('li').classList.toggle('selected')
      } else if (e.shiftKey) {
        selectFromLast(e.target.closest('li'));
      } else {
        selectSingle(e.target.closest('li'));
        lastClickedLi = e.target.closest('li');
      }
    }
  })

  document.addEventListener('keydown', (e) => {
    const listLI = document.querySelectorAll('li');
    if (e.key == 'Delete') {
      if (confirm("Delete selected elements?")) {
        for (var index = 0; index < listLI.length; index++) {
          console.log(listLI[index])
          if (listLI[index].classList.contains('selected')) {

            task.splice(index, 1)
          }
        }
        addElement(task);
        doneCount = 0;
        countDone.innerHTML = doneCount;
        countAll.innerHTML = task.length;
        if (storageAvailable('localStorage')) {
          localStorage.setItem('todo', JSON.stringify(task))
        }

      }
    }
  })


  document.addEventListener('click', (e) => {
    const withinBoundaries = e.composedPath().includes(todo);
    const listLI = document.querySelectorAll('li');
    if (!withinBoundaries) {
      for (var index = 0; index < listLI.length; index++) {
        if (listLI[index].classList.contains('selected')) {
          listLI[index].classList.remove('selected')
        }
      }
    }


  })

  function selectFromLast(target) {
    const listLI = document.querySelectorAll('li');
    var startElem = lastClickedLi || ul.children[0];
    var isLastClickedBefore = compareDocumentPosition(startElem, target) & 4;
    let firstElem = Array.from(listLI).indexOf(startElem)
    let lastElem = Array.from(listLI).indexOf(target)
    if (isLastClickedBefore) {
      for (var index = firstElem; index <= lastElem; index++) {
        listLI[index].classList.add('selected')
      }
    } else {
      for (var index = firstElem; index >= lastElem; index--) {
        listLI[index].classList.add('selected')
      }
    }
  }

  function deselectAll() {
    for (var i = 0; i < ul.children.length; i++) {
      ul.children[i].classList.remove('selected');
    }
  }

  function selectSingle(li) {
    deselectAll();
    li.classList.add('selected');
  }

  function compareDocumentPosition(a, b) {
    return a.compareDocumentPosition ?
      a.compareDocumentPosition(b) :
      (a != b && a.contains(b) && 16) +
      (a != b && b.contains(a) && 8) +
      (a.sourceIndex >= 0 && b.sourceIndex >= 0 ?
        (a.sourceIndex < b.sourceIndex && 4) +
        (a.sourceIndex > b.sourceIndex && 2) :
        1);
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
      if (storageAvailable('localStorage')) {
        localStorage.setItem('todo', JSON.stringify(task))
      }
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