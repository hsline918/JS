const input = document.querySelector("#input");
const selectQuantity = document.querySelector("#select_quantity");
const add = document.querySelector("#add_button");
const todoList = document.querySelector("#todo_list");
const sort = document.querySelector("#sort");

add.addEventListener("click", (e) => addToDo(e));
//把寫進來的值都push都陣列裡面，再用排序的手法把他sort(並寫排序的邏輯)
//把寫進來的值，改成add進來之後再push(只需要改eventlistener的對象就好)
let todos = [];

//如果要把資料型態改變，就是push的時候改變資料形式
//再來是把todoContent的資料拆分開來，會比較好維護跟作接下來的資料處理。
function addToDo(e) {
  e.preventDefault();
  let todo = {
    id: Date(),
    quantity: selectQuantity.value,
    content: input.value,
    isChecked: false,
  };
  todos.push(todo);
  // console.log(todos);
  renderContent();
}

sort.addEventListener("change", sortToDo);

function sortToDo() {
  if (sort.value === "content") {
    todos.sort((a, b) => a.content.localeCompare(b.content));
    //localeCompare可以處理『英文字母』以外的文字比對，也可以設定特別的使用方法。

    //由於資料包含數字和字串，所以要用更複雜的方式處理。
    //但如果把資料拆分開來就會比較好處理。
  } else if (sort.value === "quantity") {
    todos.sort((a, b) => a.quantity - b.quantity);
  } else if (sort.value === "packed_status") {
    todos.sort((a, b) => Number(a.isChecked) - Number(b.isChecked));
  }
  console.log(todos);
  renderContent();
}

function renderContent() {
  todoList.textContent = "";
  todos.forEach((todoItem) => List(todoItem));
}

function List(todoItem) {
  //dynamic create elements for unknown number of todos
  const checkBox = document.createElement("input");
  const todo = document.createElement("span");
  const cross = document.createElement("span");

  //List out todos
  //然後使用textContent來修改輸出形式，但是資料格式還是可以使用。
  checkBox.type = "checkbox";
  todo.textContent = todoItem.quantity + " " + todoItem.content;
  cross.textContent = " " + "❌";

  //clear inputs
  input.value = "";
  selectQuantity.value = "";

  //checked todos
  checkBox.addEventListener("click", crossOut);
  function crossOut() {
    if (checkBox.checked === true) {
      todo.classList.add("crossOut");
      todoItem.isChecked = true; //改變isChecked的狀態
    } else {
      todo.classList.remove("crossOut");
    }
  }

  //delete todos
  cross.addEventListener("click", deleteTodo);
  function deleteTodo() {
    checkBox.remove();
    todo.remove();
    cross.remove();
    todos = todos.filter((t) => t.id !== todoItem.id);
    //這裡使用filter的原因只是為了要確認點擊下去的id(點擊就知道是哪一個id了)
    console.log(todos);
  }

  //使用規劃好的資料形式，則可以更好作sort的判斷

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
//6. 要把delete的部分也要把陣列裡面的內容刪除
//7. 增加排序邏輯：1. sort by description -> 如果陣列裡面的資料有數字也有英文應該怎麼排序比較好->最好的方式是重新思考資料結構(可能再一次重構)，而不是寫更複雜的邏輯來處理(寫完覺得不會太難) 2. 如果我想要把打勾的排序在前應該要怎麼sort?要知道boolean轉換成數字在JS是很簡單的作法，所以一樣使用sort但資料用Number()處理後再排序
//目前測試by content和by quantity是正確的
//剩下回到input order和packed status
