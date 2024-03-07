const form = document.getElementById("form");
const all = document.getElementById("all");
const done = document.getElementById("done");
const undone = document.getElementById("undone");
const removeButton = document.getElementById("removeButton");
const addField = document.getElementById("addField");
const addButton = document.getElementById("addButton");
const ul = document.getElementById("ul");

const url = "http://localhost:4730/todos";

// ++++ LOCAL STATE ++++
let state = {
  todos: [],
  filter: "all",
};

// ++++ Initial Call ++++
loadTodosFromAPI();

// ++++ FUNCTIONS ++++

//fetch from API => REFRESH function
function loadTodosFromAPI() {
  fetch(url)
    .then((response) => response.json())
    .then((todosFromAPI) => {
      state.todos = todosFromAPI;
      renderTodos();
      console.log("got todos from API");
    });
}

// RENDER function
function renderTodos() {
  ul.innerHTML = "";

  //
  //state.todos.filter(Aris Callback).forEach((todo) => {}

  state.todos.forEach((todo) => {
    // create elements for todo
    const listElement = document.createElement("li");

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

    // Append checkbox and span to the list element
    listElement.appendChild(checkboxLiEl);
    listElement.appendChild(description);

    ul.appendChild(listElement);

    // Event listener for checkbox change
    checkboxLiEl.addEventListener("change", function (event) {
      const doneState = checkbox.checked;
      todo.done = doneState;
      updateDoneState(todo);
      renderTodos();
    });
  });

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

loadTodosFromAPI();

// Update doneState (PATCH)
function updateDoneState(todo) {
  fetch(url + " / " + todo.id, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ done: todo.done }),
  })
    .then(() => loadTodosFromAPI())
    .catch((error) => window.alert(error)); //console.error(error)); => von Ari!!!  ???!!!
}

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
