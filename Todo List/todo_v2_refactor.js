const input = document.querySelector("#input");
const selectQuantity = document.querySelector("#select_quantity");
const add = document.querySelector("#add_button");
const todoList = document.querySelector("#todo_list");
const sort = document.querySelector("#sort");

add.addEventListener("click", (e) => addToDo(e));
//把寫進來的值都push都陣列裡面，再用排序的手法把他sort(並寫排序的邏輯)
//把寫進來的值，改成add進來之後再push(只需要改eventlistener的對象就好)

const todos = [];

//如果要把資料型態改變，就是push的時候改變資料形式
function addToDo(e) {
  e.preventDefault();
  let todo = {
    id: Date(),
    todoContent: selectQuantity.value + " " + input.value,
  };
  todos.push(todo);
  // console.log(todos);
  renderContent();
}

function renderContent() {
  todoList.textContent = "";
  todos.map((todoItem) => List(todoItem));
}

function List(todoItem) {
  //dynamic create elements for unknown number of todos
  const checkBox = document.createElement("input");
  const todo = document.createElement("span");
  const cross = document.createElement("span");

  //List out todos
  checkBox.type = "checkbox";
  todo.textContent = todoItem.todoContent;
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
    //這裡使用filter的原因只是為了要確認點擊下去的id(點擊就知道是哪一個id了)
  }

  //append todos to todoList div
  todoList.appendChild(checkBox);
  todoList.appendChild(todo);
  todoList.appendChild(cross);
}

//改寫成React的思考方式：
//1. 用[]來裝資料，也方便之後sort
//2. 先把資料只要傳進來就會push到我的陣列
//3. 然後做render的動作：基本上還是需要DOM的操作。
//4. 所以一步一步來就是先把所有的資料叫出來，然後append到DOM上面
//5. 如果想要仔細調整render的形式，可以再把他包到另外一個function裡面，要render的時候呼叫他。
//6. TODO: 要把delete的部分也要把陣列裡面的內容刪除
