"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var addInput = document.getElementById('input_task');
  var addButton = document.getElementById('add_task_btn');
  var todosWrapper = document.getElementById('todo_wrapper');
  var todo = document.querySelector('.todo');
  var filterTodo = document.querySelector('.wrapper_count_todo');
  var filterDone = document.querySelector('.wrapper_count_done');
  var filterAll = document.querySelector('.wrapper_count_all');
  var deleteChoose = document.querySelector('.btn_delete_choose');
  var deleteAll = document.querySelector('.btn_delete_all');
  var countDone = document.getElementById('count_done');
  var countToDo = document.getElementById('count_todo');
  var countAll = document.getElementById('count_all');
  var todoItems = [];
  var task = [];
  var activeTask = [];
  var todoCount = 0,
      doneCount = 0,
      idElem = 0;

  function Task(description, id) {
    this.description = description;
    this.state = false;
    this.id = id;
  }

  function createTemplate(task, index) {
    return "\n    <li class='add_item ".concat(task.state ? 'checked' : '', "'>\n      <div class='descriptions_wrapper'>\n        <input class=\"btn_state\" type=\"checkbox\" id='item_").concat(index, "'  ").concat(task.state ? 'checked' : '', ">\n        <label for='item_").concat(index, "' class=\"descriptions\">").concat(task.description, "</label>\n      </div>\n      <button class='btn btn_delete' id='del_item_").concat(index, "'>Delete</button>\n    </li>  ");
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
      activeTask = task.filter(function (item) {
        item.state == false;
      });
    }

    if (parametr == 2) {
      activeTask = task.filter(function (item) {
        item.state == true;
      });
    }

    addElement(activeTask);
  }

  function sortTask() {
    task.sort(function (a, b) {
      return a.state - b.state;
    });
  }

  function addElement(arr) {
    todosWrapper.innerHTML = "";

    if (arr.length > 0) {
      arr.forEach(function (item, index) {
        todosWrapper.innerHTML += createTemplate(item, index);
      });
      todoItems = document.querySelectorAll('.add_item');
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
      for (var i = 0; i < task.length; i++) {
        if (activeTask[index] == task[i]) {
          task.splice(i, 1);
        }
      }
    } else {
      task.splice(index, 1);
    }

    countAll.innerHTML = '';
    countAll.innerHTML += task.length;
    addElement(task);
  }

  deleteAll.addEventListener('click', function () {
    if (confirm("Delete all elements?")) {
      task.length = 0;
      addElement(task);
      todoCount = 0;
      doneCount = 0;
      countToDo.innerHTML = todoCount;
      countDone.innerHTML = doneCount;
      countAll.innerHTML = task.length;
    }
  });
  deleteChoose.addEventListener('click', function () {
    var countState = 0;

    if (confirm("Delete selected elements?")) {
      for (var i = 0; i < task.length; i++) {
        if (task[i].state == true) {
          countState++;
        }
      }

      task.length = task.length - countState;
      addElement(task);
      doneCount = 0;
      countDone.innerHTML = doneCount;
      countAll.innerHTML = task.length;
      localStorage.setItem('todo', JSON.stringify(task));
    }
  });
  filterTodo.addEventListener('click', function () {
    filterTask(1);
    document.querySelector(".todo").classList.toggle("todo-moved");
    filterTodo.classList.add('active');
    filterDone.classList.remove('active');
    filterAll.classList.remove('active');
  });
  filterDone.addEventListener('click', function () {
    filterTask(2);
    document.querySelector(".todo").classList.toggle("todo-moved");
    filterDone.classList.add('active');
    filterTodo.classList.remove('active');
    filterAll.classList.remove('active');
  });
  filterAll.addEventListener('click', function () {
    addElement(task);
    document.querySelector(".todo").classList.toggle("todo-moved");
    filterAll.classList.add('active');
    filterDone.classList.remove('active');
    filterTodo.classList.remove('active');
  });
  todo.addEventListener('click', function (e) {
    if (e.target.classList.value == "btn_state") {
      if (confirm("Move selected element?")) {
        for (var i = 0; i < task.length; i++) {
          if (e.target.id == "item_" + i) {
            compliteTask(i);
            localStorage.setItem('todo', JSON.stringify(task));
          }
        }
      } else {
        e.preventDefault();
      }
    }

    if (e.target.classList.value == "btn btn_delete") {
      if (confirm("Delete selected element?")) {
        for (var _i = 0; _i < task.length; _i++) {
          if (e.target.id == "del_item_" + _i) {
            deleteTask(_i);
            localStorage.setItem('todo', JSON.stringify(task));
          }
        }
      }
    }
  });

  if (localStorage.getItem('todo')) {
    task = JSON.parse(localStorage.getItem('todo'));
    addElement(task);
    countAll.innerHTML = task.length;

    for (var i = 0; i < task.length; i++) {
      task[i].state ? doneCount += 1 : todoCount += 1;
    }

    countToDo.innerHTML = todoCount;
    countDone.innerHTML = doneCount;
  }

  addButton.addEventListener('click', function () {
    actionInput();
  });
  addInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      actionInput();
    }
  });

  function actionInput() {
    if (addInput.value.length > 0) {
      countToDo.innerHTML = '';
      idElem += 1;
      task.push(new Task(addInput.value, idElem));
      sortTask();
      addElement(task);
      localStorage.setItem('todo', JSON.stringify(task));
      addInput.value = '';
      countAll.innerHTML = '';
      countAll.innerHTML += task.length;
      todoCount++;
      countToDo.innerHTML += todoCount;
    } else {
      alert('Please, write your task');
    }
  }
});