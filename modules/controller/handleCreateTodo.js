
const todoTitle = document.getElementById("title");
const todoDesc = document.getElementById("desc");
const mainList = document.getElementById("main");
import { toastify } from "./../components/toastify.js";


function getLoccatedTodos(){
  const savedLCTodos = localStorage.getItem("todosList");
  return JSON.parse(savedLCTodos)?.sort((a, b) => a.id - b.id) || [];
}

let savedTodos = [...getLoccatedTodos()];

const createNewTodo = (title, desc, id, checked) => {

  const listItem = document.createElement("li");
  listItem.className = "list-item";
  listItem.id = id;


  const todoTitleHeading = document.createElement("h3");
  const todoTitleInput = document.createElement("input");
  todoTitleInput.disabled = true;
  todoTitleInput.className = "title-input";
  todoTitleInput.defaultValue = title;
  todoTitleHeading.appendChild(todoTitleInput);
  todoTitleHeading.style.color= "black";
  if (checked) {
    todoTitleHeading.style.backgroundColor = "green";
  }

  const todoDescPara = document.createElement("p");
  todoDescPara.innerHTML = desc;


  listItem.appendChild(todoTitleHeading);
  listItem.appendChild(todoDescPara);


  const todoActions = `<div>
      
      <button data-id="${id}" type="button" class="btn btn-outline-danger">DEL</button>
      <button data-id="${id}" type="button" class="btn btn-outline-secondary">EDIT</button>
      <button data-id="${id}" type="button" class="btn btn-outline-success">CHECK</button>
      </div>`;


  listItem.innerHTML += todoActions;


  mainList.appendChild(listItem);
};

function renderTodoElement(){
getLoccatedTodos().forEach((todo) =>
  createNewTodo(todo.title, todo.desc, todo.id, todo.checked)
);}
renderTodoElement();

export const handleCreateNewTodo = (event) => {

  event.preventDefault();


  if (!todoTitle.value)
    return toastify("please enter a valid title ...", {
      time: 1000,
      type: "warn",
    });
  const newTodo = {
    id: Date.now(),
    title: todoTitle.value,
    desc: todoDesc.value,
    checked: false,
  };

  savedTodos.push(newTodo);
  console.log(savedTodos);

  localStorage.setItem("todosList", JSON.stringify(savedTodos));
  createNewTodo(newTodo.title, newTodo.desc, newTodo.id);
};

mainList.addEventListener("click", (e) => {
  if (e.target.innerText === "DEL") {
    const todoEl = e.target.parentElement.parentElement;
    console.log(todoEl.id);
    const filtredTodos = getLoccatedTodos().filter(
      (item) => item.id !== Number(todoEl.id)
    );
    localStorage.setItem("todosList", JSON.stringify(filtredTodos));
    mainList.innerHTML = '';
    renderTodoElement();
  } else if (e.target.innerText === "CHECK") {
    const filtredTodo = getLoccatedTodos().filter(
      (item) => item.id === Number(id)
    );
    const updateFiltredTodo = { ...filtredTodo[0], checked: true };
    const filtredTodos = savedTodos.filter(
      (item) => item.id !== Number(todoEl.id)
    );
    const updateSavedTodos = [...filtredTodos, updateFiltredTodo];
    localStorage.setItem("todosList", JSON.stringify(updateSavedTodos));
    mainList.innerHTML = "";
    renderTodoElements();
  } else if (e.target.innerText === "EDIT") {
    const todoEl = e.target.parentElement.parentElement;
    todoEl.children[0].children[0].disabled = false;
    todoEl.children[0].children[0].select();
    todoEl.children[0].children[0].style.backgroundColor = "blue";
    e.target.innerText = "SAVE";
    e.target.addEventListener("click", () => {
      const filtredTodo = getLoccatedTodos().filter(
        (item) => item.id === Number(id)
      );
      const updateFiltredTodo = { ...filtredTodo[0], title: todoEl.children[0].children[0].value };

      const filtredTodos = getLoccatedTodos().filter(
        (item) => item.id !== Number(id)
      );
      const updateSavedTodos = [...filtredTodos, updateFiltredTodo];
      localStorage.setItem("todosList", JSON.stringify(updateSavedTodos));
      mainList.innerHTML = "";
      renderTodoElements();
    });
  }
});
