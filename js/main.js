// Элемент на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// Добавление задачи

form.addEventListener("submit", addTask);

// Удаление задачи

tasksList.addEventListener("click", deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener("click", doneTask);

// Функции
function addTask(event) {
  //Оомена отправки формы
  event.preventDefault();

  // Достаем текст
  const taskText = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавим задачу в массив с задачами
  tasks.push(newTask);

  // Сохраняем список задач в хранилище браузера LocalStorage
  saveToLokaleStorage();

  renderTask(newTask);

  //Очищаем инпут
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".list-group-item");

  // Определяем ID задачи

  const id = Number(parentNode.id);

  // Удаляем задачу через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);

  // Сохраняем список задач в хранилище браузера LocalStorage
  saveToLokaleStorage();

  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;
  // проверяем что клик был по кнопке "задача выполнена"

  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  // const task = tasks.find(function (task) {
  //   if (task.id === id) {
  //     return true;
  //   }
  // });

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  // Сохраняем список задач в хранилище браузера LocalStorage
  saveToLokaleStorage();

  console.log(task);

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLokaleStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title--done" : "task-title";
  // Новая разметка для задачи
  const taskHTML = `
  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
      </button>
      <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
      </button>
  </div>
</li>`;

  //Добавляем задачу на страницу

  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
