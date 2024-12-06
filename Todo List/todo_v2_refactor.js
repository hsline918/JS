const input = document.getElementById("input");
const selectQuantity = document.getElementById("select_quantity");
const add = document.getElementById("add_button");
const todoList = document.getElementById("todo_list");
const deleteList = document.getElementById("deleted_list");
const sort = document.getElementById("sort");
const restore = document.getElementById("restore");

add.addEventListener("click", (e) => addToDo(e));
//把寫進來的值都push都陣列裡面，再用排序的手法把他sort(並寫排序的邏輯)
//把寫進來的值，改成add進來之後再push(只需要改eventlistener的對象就好)
let todos = [];
let deleteTodos = [];
//如果要把資料型態改變，就是push的時候改變資料形式
//再來是把todoContent的資料拆分開來，會比較好維護跟作接下來的資料處理。
function addToDo(e) {
  e.preventDefault();
  let todo = {
    id: Date(),
    quantity: selectQuantity.value,
    content: input.value,
    isChecked: false,
    order: todos.length,
  };
  todos.push(todo);
  sortToDo();
}

sort.addEventListener("change", sortToDo);

function sortToDo() {
  let sortedTodos = [...todos];
  if (sort.value === "input_order") {
    sortedTodos.sort((a, b) => a.order - b.order);
  }
  if (sort.value === "content") {
    sortedTodos.sort((a, b) => a.content.localeCompare(b.content));
    // console.log(todos);
    //localeCompare可以處理『英文字母』以外的文字比對，也可以設定特別的使用方法。

    //由於資料包含數字和字串，所以要用更複雜的方式處理。
    //但如果把資料拆分開來就會比較好處理。
  } else if (sort.value === "quantity") {
    sortedTodos.sort((a, b) => a.quantity - b.quantity);
  } else if (sort.value === "packed_status") {
    for (const i of todos) {
      console.log(i.isChecked);
      if (i.isChecked === true) {
        sortedTodos.sort((a, b) => Number(a.isChecked) - Number(b.isChecked));
        break;
      }
    }
  }
  //用更簡潔的方式，把他改成for...of 的寫法，比for迴圈更容易理解。

  //這裡如果沒有勾選的話，他會回到跟原始陣列一樣的排序。
  todos = sortedTodos;
  //如果想要讓狀態保留在上一個sorted的結果，就需要更新todos.不然從一開始的let sortedTodos = [...todos];會一直用原始陣列來作潛拷貝，沒法保留修改過的陣列。
  renderContent(sortedTodos);
}

function renderContent(todos) {
  todoList.textContent = "";
  todos.forEach((todoItem) => List(todoItem));
}

function renderDeleteTodos() {
  deleteTodos.forEach((deletedTodo) => List(deletedTodo));
}

restore.addEventListener("click", (e) => restoreTodo(e));
function restoreTodo(e) {
  e.preventDefault();
  let restoreTodo = deleteTodos.pop();
  todos.push(restoreTodo);
  sortToDo();
}

function List(todoItem) {
  //dynamic create elements for unknown number of todos
  const checkBox = document.createElement("input");
  const todo = document.createElement("span");
  const cross = document.createElement("span");
  const label = document.createElement("label");

  //List out todos
  //然後使用textContent來修改輸出形式，但是資料格式還是可以使用。
  checkBox.type = "checkbox";
  checkBox.id = `${todoItem.id}`;
  label.htmlFor = `${todoItem.id}`;
  todo.textContent = todoItem.quantity + " " + todoItem.content;
  cross.textContent = " " + "❌";

  //clear inputs
  input.value = "";
  selectQuantity.value = "1";
  //如果沒有這一行的話，他會記住上次輸入的數量。可能還是讓他還原成1顯示初始狀態

  //make sure check and crossed out styling is applied.
  checkBox.checked = todoItem.isChecked;
  if (todoItem.isChecked) {
    todo.classList.add("crossOut");
  }

  //checked todos
  checkBox.addEventListener("click", crossOut);
  function crossOut() {
    if (checkBox.checked === true) {
      todo.classList.add("crossOut");
      todoItem.isChecked = true; //改變isChecked的狀態
    } else {
      todo.classList.remove("crossOut");
      todoItem.isChecked = false;
    }
    sortToDo();
  }

  //delete todos
  cross.addEventListener("click", deleteTodo);
  function deleteTodo() {
    //這裡有一個問題就是，他不需要call render就可以把資料show在網頁上面：是因為他直接操作DOM。

    todos = todos.filter((t) => t.id !== todoItem.id);
    //資料更新
    sortToDo(); //立刻render最新資料

    const deleteTodo = todos.find((t) => t.id === todoItem.id);
    //這個只會返回第一個找到的值
    deleteTodos.push(deleteTodo);
    deleteList.appendChild(checkBox);
    label.appendChild(todo);
    deleteList.appendChild(label);
    deleteList.appendChild(cross);
    //checkBox.remove(); todo.remove(); cross.remove();
    //12/5 因為這裡使用remove()會把這三個元素直接移除，但如果其他地方還有用到這裡的資訊可能會造成資料不一的狀況。但下方有更新資料

    //這裡使用filter的原因只是為了要確認點擊下去的id(點擊就知道是哪一個id了)
  }

  //使用規劃好的資料形式，則可以更好作sort的判斷

  //append todos to todoList div
  todoList.appendChild(checkBox);
  label.appendChild(todo);
  todoList.appendChild(label);
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
//12/4 測試過後發現packed status是有作用的，可是re-render之後會讓原本的crossed out class 不見。
//我們在List裡面新增了一個用todoItem的狀態來設定checkbox的打溝狀態和劃掉的styling.
//目前遇到我要sort by input order的時候沒有辦法還原原本的陣列狀態。
//想到toSorted的方法和Claude討論，但這樣需要維護兩個陣列。所以我們用建立order index的方式來紀錄哪些todo是先加入的。用潛拷貝是預防我們排序錯誤，所拷貝出來操作的陣列，預防修改到原始陣列。
//有注意到todo沒有跟checkbox關聯在一起，所以做了修正。
//HTML 文件中：直接使用 for 屬性，JavaScript 中：必須使用 htmlFor 屬性(避免跟for迴圈搞//混)
//目前的功能看起來正常，1. 但還是如果沒有勾選check的部分，然後我之前是用別的方式排列，他會照input order排列。就不是沒有變動的結果。
//2. 另外一個是如果我沒有重新勾選的話(經過re-render)，他不會依照選取的內容直接渲染。->這裡需要添加一個『資料變更的時候需要主動觸發渲染』。
