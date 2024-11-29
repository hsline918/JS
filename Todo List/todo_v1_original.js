const input = document.querySelector("#input");
const selectQuantity = document.querySelector("#select_quantity");
const add = document.querySelector("#add_button");
const todoList = document.querySelector("#todo_list");
const sort = document.querySelector("#sort");

add.addEventListener("click", (e) => todoFunc(e));

function todoFunc(e) {
  e.preventDefault();
  //dynamic create elements for unknown number of todos
  const checkBox = document.createElement("input");
  const todo = document.createElement("span");
  const cross = document.createElement("span");

  //List out todos
  checkBox.type = "checkbox";
  todo.textContent = selectQuantity.value + input.value;
  cross.textContent = " " + "❌";

  //clear inputs
  input.value = "";
  selectQuantity.value = "";

  //checked todos
  checkBox.addEventListener("click", crossOut);
  function crossOut() {
    if (checkBox.checked === true) {
      todo.classList.add("crossOut");
    } else {
      todo.classList.remove("crossOut");
    }
  }
  //delete todo
  cross.addEventListener("click", deleteTodo);
  function deleteTodo() {
    checkBox.remove();
    todo.remove();
    cross.remove();
  }

  //append todos to todoList div
  todoList.appendChild(checkBox);
  todoList.appendChild(todo);
  todoList.appendChild(cross);
}

//!no好的做法：用物件管理資料及狀態(最後的格式)
// let todos = [
//   {
//     id: 1,
//     text: "買牛奶",
//     completed: false,
//   },
// ];
