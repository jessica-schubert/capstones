const form = document.getElementById("form");
const all = document.getElementById("all");
const done = document.getElementById("done");
const undone = document.getElementById("undone");
const removeButton = document.getElementById("removeButton");
const addField = document.getElementById("addField");
const addButton = document.getElementById("addButton");
const ul = document.getElementById("ul");


// get sure that DOM was completely initialized
document.addEventListener("DOMContentLoaded", function () {
    const todoList = document.getElementById("todoList");
};

//state
let state = {
  todos: [{}],
  filter: "all", //default filter is 'all'
};
//receive state vom localStorage
const rawAppState = localStorage.getItem("state.todos");

if (rawAppState !== null) {
  const receivedAppState = JSON.parse(rawAppState);
  state = receivedAppState;
}

//rendering
function render() {
  ul.innerHTML = "";

  //safe state in local storage
  localStorage.setItem("state.todos", JSON.stringify(state));

  for (let i = 0; i < state.todos.length; ++i) {
    const todo = state.todos[i];

    // create elements for todo
    const listElement = document.createElement("li");
    // unnötig? listElement.setAttribute("id", todo.id);

    //create checkbox für todo
    const checkboxLiEl = document.createElement("input");
    checkboxLiEl.setAttribute("type", "checkbox");
    checkboxLiEl.checked = todo.done;
    //checkboxLiEl.setAttribute("checked", todo.done);

    listElement.appendChild(checkboxLiEl);

    // Create span element for todo description
    const description = document.createElement("span");
    description.textContent = todo.description;
    description.style.padding = ".5rem";

    // Durchgestrichen, wenn die Checkbox gecheckt ist, sonst normal
    description.style.textDecoration = todo.done ? "line-through" : "none";
    // ---> description.classList.add ("todoDescription")

    // Event listener for checkbox change
    checkboxLiEl.addEventListener("change", function () {
      todo.done = !todo.done;
      render();
    });

    // Append checkbox and span to the list element
    listElement.appendChild(checkboxLiEl);
    listElement.appendChild(description);

    ul.appendChild(listElement);
    // filter todos based on the selected filter
    const filteredTodos = filteredTodos(state.todos, state.filter);
  }
}

// filtered todos based on the selected filter
function filterTodos(todos, filter) {
  switch (filter) {
    case "all":
      return todos;
    case "done":
      return todos.filter((todo) => todo.done);
    case "undone":
      return todos.filter((todo) => !todo.done);
    default:
      return todos;
  }
}
render();
//actions;
function toDoLi(li) {
  state.todos = state.todos;
}
render();

//eventlistener for static elements

//remove done Todos
function removeDoneTodos() {
  state.todos = state.todos.filter((todo) => todo.done !== true);
  render();
}

removeButton.addEventListener("click", removeDoneTodos);
render();

// set filter when radio button changes
function setFilter(event) {
  state.filter = event.target.value;
  render();
}

all.addEventListener("change", setFilter);
render();
done.addEventListener("change", setFilter);
render();
undone.addEventListener("change", setFilter);
render();

//eventlistener for dynamic elements

// add new todo
function addTodo() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime(); //Zeitstempel in Millisekunden

  // Zeitstempel in Hexadezimalkette umwandeln
  const hexString = timestamp.toString(16);

  // ID erstellen
  const uniqueId = "id_" + hexString;
  const newTodo = {
    id: uniqueId,
    description: document.getElementById("addField").value,
    done: false,
  };
  state.todos.push(newTodo);
  addField.value = ""; // Clear the input field after adding a todo

  render();
}
addButton.addEventListener("click", addTodo);
render();

//Initial rendering
render();
