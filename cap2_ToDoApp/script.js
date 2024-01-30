const form = document.getElementById("form");
const all = document.getElementById("all");
const done = document.getElementById("done");
const undone = document.getElementById("undone");
const removeButton = document.getElementById("removeButton");
const addField = document.getElementById("addField");
const addButton = document.getElementById("addButton");
const ul = document.getElementById("ul");

//STATE
let state = {
  todos: [],
  filter: "all", //default filter is 'all'
};
//receive state vom localStorage
const rawAppState = localStorage.getItem("state.todos");

if (rawAppState !== null) {
  const receivedAppState = JSON.parse(rawAppState);
  state = receivedAppState;
}

// RENDER
function render() {
  ul.innerHTML = "";

  //safe state in localStorage
  localStorage.setItem("state.todos", JSON.stringify(state));

  const filteredTodos = filterTodos(state.todos, state.filter);

  for (let i = 0; i < filteredTodos.length; i++) {
    const todo = filteredTodos[i];

    // create elements for todo
    const listElement = document.createElement("li");
    // unnötig? listElement.setAttribute("id", todo.id);

    //create checkbox für todo
    const checkboxLiEl = document.createElement("input");
    checkboxLiEl.setAttribute("type", "checkbox");
    checkboxLiEl.checked = todo.done;

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
  }

  if (state.filter === "all") {
    all.checked = true;
  }
  if (state.filter === "undone") {
    undone.checked = true;
  }
  if (state.filter === "done") {
    done.checked = true;
  }
}

//filter todos
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

//filterTodos (state.todos, "done")

//actions;

//eventlistener for static elements

// Event listener for checkbox change
//remove done todos
function removeDoneTodos() {
  state.todos = state.todos.filter((todo) => todo.done !== true);
  render();
}
removeButton.addEventListener("click", removeDoneTodos);

// set filter when radio button changes
/*function setFilter(event) {
  state.filter = event.target.id;
  render();

  undone.addEventListener("change", setFilter);
} */

all.addEventListener("change", () => {
  state.filter = "all";
  render();
});

done.addEventListener("change", () => {
  state.filter = "done";
  render();
});
undone.addEventListener("change", () => {
  state.filter = "undone";
  render();
});

//EVENTLISTENER for dynamic elements

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

//Initial rendering
render();
