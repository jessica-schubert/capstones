const form = document.getElementById("form");
const all = document.getElementById("all");
const done = document.getElementById("done");
const undone = document.getElementById("undone");
const removeButton = document.getElementById("removeButton");
const textInput = document.getElementById("addField");
const addButton = document.getElementById("addButton");
const ul = document.getElementById("ul");
const emptyTrashButton = document.getElementById("empty-trash-btn");
const trashNumber = document.getElementById("trash-number");

const removeForm = document.getElementById("removeForm");
const addForm = document.getElementById("addForm");

const url = "http://localhost:4730/todos";

// +++++ STATE ++++
let state = {
  todos: [],
  filter: "all", //default filter
};

// +++++ Initial Call +++++
// fetch from API
refresh();

// +++++ FUNCTIONS +++++

// ++++ REFRESH function ++++

function refresh() {
  fetch(url)
    .then((response) => response.json())
    .then((todosFromAPI) => {
      (state.todos = todosFromAPI), render(), console.log("Got your Todos!");
    })
    .catch((error) => console.error("So sorry, can't find your todos..."));
}

// +++++ RENDER function +++++

function render() {
  ul.innerHTML = "";

  state.todos
    .filter((todo) => {
      if (todo.deleted) return false;
      return true;
    })
    .filter((todo) => {
      if (state.filter === "done") {
        return todo.done === true;
      } else if (state.filter === "undone") {
        return todo.done === false;
      }
      return true;
    })
    .forEach((todo) => {
      // create list element for todo
      const listElement = document.createElement("li");
      // create checkbox for todo
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.checked = todo.done;

      // create span element for todo description
      const description = document.createElement("input");

      description.value = todo.description;
      description.style.padding = ".5rem";
      // Durchgestrichen, wenn die Checkbox gecheckt ist, sonst normal
      description.style.textDecoration = todo.done ? "line-through" : "none";
      description.style.background = "transparent";
      description.style.border = "none";

      description.addEventListener("change", () => {
        fetch(url + "/" + todo.id, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ description: description.value }),
        })
          .then(() => refresh())
          .catch((error) => window.alert(error)); //console.error(error);
      });

      // append checkbox and span to list element
      listElement.appendChild(checkbox);
      listElement.appendChild(description);

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";

      removeButton.addEventListener("click", () => {
        fetch(url + "/" + todo.id, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ deleted: true }),
        })
          .then(() => {
            refresh();
          })
          .catch((error) =>
            window.alert("Sorry, can't handle this at the moment!")
          );
      });

      listElement.appendChild(removeButton);

      // append list element to ul
      ul.appendChild(listElement);

      // event listener for checkbox change
      checkbox.addEventListener("change", function (event) {
        // todo.done = !todo.done;
        const doneState = checkbox.checked;
        todo.done = doneState;
        updateDoneState(todo);
        render();
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

  trashNumber.textContent = state.todos.filter((todo) => todo.deleted).length;
}
// ----- End of RENDER function --------

// eventListener

// checkbox changes
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

// PATCH doneState
function updateDoneState(todo) {
  fetch(url + "/" + todo.id, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ done: todo.done }),
  })
    .then(() => refresh())
    .catch((error) => window.alert(error)); //console.error(error);
}

//EVENTLISTENER for dynamic elements

// add new todo
function addTodo() {
  const todoValue = textInput.value;

  //proof of value
  if (!todoValue.trim()) {
    window.alert("Isn't there anything to do?");
    return;
  }

  if (
    state.todos.some(
      (todo) =>
        todo.description.toLowerCase().trim() === todoValue.toLowerCase().trim()
    )
  ) {
    window.alert("You already got that on your list!");
    return;
  }

  // POST  newTodo
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ description: todoValue, done: false }),
  })
    .then((response) => {
      refresh();
      if (response.ok) {
        textInput.value = ""; // Clear the input field after adding a todo
      }
    })
    .catch((error) => window.alert("struggling with something..")); // console.error(error));
  render();
}

// addButton.addEventListener("click", addTodo);
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo();
});

//remove done todos
function removeDoneTodos() {
  state.todos.forEach((todo) => {
    if (todo.done) {
      fetch(url + "/" + todo.id, {
        method: "DELETE",
      })
        .then(() => {
          refresh();
        })
        .catch((error) =>
          window.alert("Sorry, can't handle this at the moment!")
        );
    }
  });
}

function emptyTrashBin() {
  state.todos.forEach((todo) => {
    if (todo.deleted) {
      fetch(url + "/" + todo.id, {
        method: "DELETE",
      })
        .then(() => {
          refresh();
        })
        .catch((error) =>
          window.alert("Sorry, can't handle this at the moment!")
        );
    }
  });
}

// removeButton.addEventListener("click", removeDoneTodos);
removeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  removeDoneTodos();
});

emptyTrashButton.addEventListener("click", emptyTrashBin);

//Initial rendering
refresh();
render();
