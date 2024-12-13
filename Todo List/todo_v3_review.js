const quantity = document.getElementById("select_quantity");
const input = document.getElementById("input");
const buttonAdd = document.getElementById("add_button");
const todoList = document.getElementById("todo_list");
const deleteList = document.getElementById("deleted_list");
const sort = document.getElementById("sort");
const restore = document.getElementById("restore");

//先建立資料結構, data-driven UI
let todos = [];
let deleteTodos = [];

buttonAdd.addEventListener("click", (e) => addTodo(e));

function addTodo(e) {
  e.preventDefault();
  const todo = {
    id: Date(),
    quantity: quantity.value,
    content: input.value,
    order: todos.length,
    isChecked: false,
  };
  todos.push(todo);
  quantity.value = "1";
  input.value = "";
  renderTodo();
}

function renderTodo() {
  todoList.innerText = "";
  todos.forEach((el) => List(el));
}

function List(el) {
  const checkBox = document.createElement("input");
  const quantity = document.createElement("span");
  const item = document.createElement("span");
  const cross = document.createElement("span");
  const label = document.createElement("label");

  checkBox.type = "checkbox";
  quantity.innerText = `${el.quantity}`;
  item.innerText = ` ${el.content}`;
  cross.innerText = " ❌";
  checkBox.id = `${el.id}`;
  label.htmlFor = `${el.id}`;

  //這個區塊主要在控制每一個to-do的邏輯：1.監聽變化 2.crossOut function裡面包含檢視瀏覽器丟回來的狀態->檢查是否要加上UI styling。3. 另外是要在同時更新這個元素的資料。 4.最後要讓UI在使用者輸入後同時顯示最新的UI排序。
  checkBox.addEventListener("click", crossOut);
  function crossOut() {
    //小心typo，這裡是checked不是check...打成check使用console.log會看不出來，因為他會返回undefined...
    //這裡是使用者勾選, 給予styling以及更新資料
    if (checkBox.checked === true) {
      quantity.classList.add("crossOut");
      item.classList.add("crossOut");
      el.isChecked = true;
    } else {
      quantity.classList.remove("crossOut");
      item.classList.remove("crossOut");
      el.isChecked = false; //原本這裡都寫成true所以怎麼按狀態都是true ^^"
    }
    sortTodo(); //這裡主要讓資料有修改之後馬上sort後render(可以讓頁面處於最新的狀態。)
    //因為這部份有來自使用者的輸入，所以要特別處理資料更新的部分。
  }

  //這裡的功用是讓sort更改了陣列順序，還是有之前的styling。為使用之前使用者輸入的資料驅動UI
  checkBox.checked = el.isChecked; //這行是使打勾的UI也和資料同步
  //下方是劃掉的線和UI資料一樣同步
  if (el.isChecked === true) {
    quantity.classList.add("crossOut");
    item.classList.add("crossOut");
  } else {
    quantity.classList.remove("crossOut");
    item.classList.remove("crossOut");
  }

  cross.addEventListener("click", deleteItem);
  function deleteItem() {
    //這裡的邏輯有時候會搞混，陣列方法會自己有一個參數再去遍歷一次
    //find會找到delete的item，並不會修改原陣列。
    let deleteItem = todos.find((t) => t.id === el.id);
    deleteTodos.push(deleteItem);
    renderDeleteTodos();

    todos = todos.filter((t) => t.id !== el.id);
    renderTodo();
  }
  todoList.appendChild(checkBox);
  label.appendChild(quantity);
  label.appendChild(item);
  todoList.appendChild(label);
  todoList.appendChild(cross);
}

sort.addEventListener("change", sortTodo); //小心這裡是"change",不是click

function sortTodo() {
  const sortTodo = [...todos]; //這裡可能比較需要記憶一下，要排列的時候要注意陣列是否修改正確，不然會先複製一個陣列。

  //這裡單純只有對資料做排列，並且更新todo
  if (sort.value === "input_order") {
    sortTodo.sort((a, b) => a.order - b.order);
  } else if (sort.value === "content") {
    sortTodo.sort((a, b) => a.content.localeCompare(b.content));
  } else if (sort.value === "quantity") {
    sortTodo.sort((a, b) => a.quantity - b.quantity);
  } else if (sort.value === "packed_status") {
    sortTodo.sort((a, b) => Number(a.isChecked) - Number(b.isChecked));
  }
  todos = sortTodo;
  renderTodo();
}

restore.addEventListener("click", restoreTodo);

function restoreTodo() {
  let previous = deleteTodos.pop();
  todos.push(previous);
  renderTodo();
  renderDeleteTodos();
}

function renderDeleteTodos() {
  deleteList.innerText = "";
  deleteTodos.forEach((el) => deleteTodosFun(el));
}
function deleteTodosFun(el) {
  const checkBox = document.createElement("input");
  const quantity = document.createElement("span");
  const item = document.createElement("span");
  const cross = document.createElement("span");
  const label = document.createElement("label");

  checkBox.type = "checkbox";
  quantity.innerText = `${el.quantity}`;
  item.innerText = ` ${el.content}`;
  cross.innerText = " ❌";
  checkBox.id = `${el.id}`;
  label.htmlFor = `${el.id}`;

  checkBox.checked = el.isChecked;
  //這裡讓他先以資料驅動UI。再來就是使使用者按下按鈕的反應是無效的。就是把checked的屬性寫死，不可以更改。
  crossOut();
  function crossOut() {
    if (el.isChecked === true) {
      quantity.classList.add("crossOut");
      item.classList.add("crossOut");
      checkBox.checked = true;
    } else {
      quantity.classList.remove("crossOut");
      item.classList.remove("crossOut");
      checkBox.checked = false;
    }
  }
  checkBox.addEventListener("click", crossOut);

  deleteList.appendChild(checkBox);
  label.appendChild(quantity);
  label.appendChild(item);
  deleteList.appendChild(label);
  deleteList.appendChild(cross);
}
