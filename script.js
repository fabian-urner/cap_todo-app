"use strict";

// ---------------------------
// App-Functions
// ---------------------------

const getDefaultState = () => {
  const newState = {
    todos: [],
    filter: "all",
  };

  for (let i = 0; i < 3; i++) {
    const tempId = crypto.randomUUID();

    newState.todos.push({
      title: "Das " + (i + 1) + ". Todo.",
      done: false,
      id: tempId,
    });
  }

  return newState;
};

const render = () => {
  localStorage.setItem("todoAppState", JSON.stringify(state));

  // Section: "Add Todo"
  textBoxTodo.setAttribute("placeholder", "Get sh*t done!");

  // Section: "ToDo-List"
  todoList.innerHTML = "";

  state.todos.forEach((todo) => {
    switch (state.filter) {
      case "open":
        if (todo.done) return;
        break;
      case "done":
        if (!todo.done) return;
        break;
    }

    const listItem = document.createElement("li");

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", todo.id);
    checkBox.checked = todo.done;

    const label = document.createElement("label");
    label.setAttribute("for", todo.id);
    label.innerText = todo.title;

    listItem.append(checkBox, label);

    todoList.appendChild(listItem);
  });
};

const addTodo = (todoText) => {
  let todoExistsAlready = false;

  state.todos.forEach((todo) => {
    if (
      !todoExistsAlready &&
      todo.title.toLowerCase() === todoText.toLowerCase()
    ) {
      todoExistsAlready = true;
      window.alert("Todo bereits vorhanden.");
    }
  });

  if (todoExistsAlready) return;

  const todoId = crypto.randomUUID();
  const newTodo = {
    title: todoText,
    done: false,
    id: todoId,
  };

  state.todos.push(newTodo);
};

const filterTodos = (filter) => {
  state.filter = String(filter).toLowerCase();
};

const removeDoneTodos = () => {
  state.todos = state.todos.filter((item) => !item.done);
};

const changeTodoStatus = (element) => {
  if (!(element.nodeName === "INPUT")) {
    element = element.parentElement.childNodes[0];
    element.checked = !element.checked;
  }

  state.todos.forEach((todo) => {
    if (todo.id === element.id) {
      todo.done = element.checked;
    }
  });
};

// ---------------------------
// App-State
// ---------------------------
let state = null;

// manage local storage
if (!localStorage.getItem("todoAppState")) {
  localStorage.setItem(
    "todoAppState",
    JSON.stringify((state = getDefaultState()))
  );
} else {
  state = JSON.parse(localStorage.getItem("todoAppState"));
}

// ---------------------------
// Render App on Load
// ---------------------------
window.addEventListener("load", (e) => {
  if (!state) {
    setDefaultState();
  }
  render();
});

// ---------------------------
// HTML-Elements
// ---------------------------
const textBoxTodo = document.getElementById("todo-text");
const btnAddTodo = document.getElementById("btn-todo-add");
const filterList = document.getElementById("filter");
const btnRemoveDoneTodos = document.getElementById("btn-remove-done");
const todoList = document.getElementById("todoList");

// ---------------------------
// Eventlisteners
// ---------------------------
btnAddTodo.addEventListener("click", (e) => {
  addTodo(String(textBoxTodo.value).trim());
  render();
});

filterList.addEventListener("click", (e) => {
  filterTodos(e.target.value);
  render();
});

btnRemoveDoneTodos.addEventListener("click", (e) => {
  removeDoneTodos();
  render();
});

todoList.addEventListener("click", (e) => {
  changeTodoStatus(e.target);
  render();
});
