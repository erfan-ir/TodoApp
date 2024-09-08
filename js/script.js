const addTodo = document.getElementById("todo-input");
const dateTodo = document.getElementById("date-input");
const addBtn = document.getElementById("btn-add");
const editBtn = document.getElementById("btn-edit");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
let todos = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAll = document.getElementById("dellet-all");
const filterBottons = document.querySelectorAll(".filter-buttons");

const gnerateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  const todoList = data || todos;
  todosBody.innerHTML = "";
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>No Task Found!</td></tr>";
    return;
  }

  todoList.forEach((todo) => {
    todosBody.innerHTML += `
      <tr>
        <td>${todo.task}</td>
        <td>${todo.date || "No Date"}</td>
        <td>${todo.completed ? "completed" : "Pending"}</td>
        <td>
          <button class="btn-edit" onclick="editHandler('${
            todo.id
          }')">Edit</button>
          <button class="btn-do" onclick="toggleHandler('${todo.id}')" >${
      todo.completed ? "Undo" : "do"
    }</button>
          <button class="btn-del" onclick="deleteHandler('${
            todo.id
          }')" >Delete</button>
        </td>
      </tr>   
    `;
  });
};

const addHandler = () => {
  const task = addTodo.value;
  const date = dateTodo.value;
  const todo = {
    id: gnerateId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    addTodo.value = "";
    dateTodo.value = "";
    showAlert("Todo added successfully", "success");
  } else {
    showAlert("Please enter a todo...", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos Delete successfuly", "success");
  } else {
    showAlert("No todos to delete", "error");
  }
};
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("delete todo successfuly", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("change successfuly", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  addTodo.value = todo.task;
  dateTodo.value = todo.date;
  addBtn.style.display = "none";
  editBtn.style.display = "inline-block";
  editBtn.dataset.id = id;
};
const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  const ids = todos.map((todo) => todo.id);
  console.log(ids);
  console.log(id);
  if (ids.includes(id)) {
    todo.task = addTodo.value;
    todo.date = dateTodo.value;
    addTodo.value = "";
    dateTodo.value = "";
    addBtn.style.display = "inline-block";
    editBtn.style.display = "none";
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo Edited", "success");
  } else {
    addBtn.style.display = "inline-block";
    editBtn.style.display = "none";
    addTodo.value = "";
    dateTodo.value = "";
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo not found!", "error");
  }
};

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};

deleteAll.addEventListener("click", deleteAllHandler);
window.addEventListener("load", () => displayTodos());
addBtn.addEventListener("click", addHandler);
editBtn.addEventListener("click", applyEditHandler);
filterBottons.forEach((button) =>
  button.addEventListener("click", filterHandler)
);
