function rand() {
  return Math.floor(Math.random() * 100) + 1;
}
let random = rand();
let roundOfGames = 0;
const submit = document.querySelector("#submit");
const reset = document.querySelector("#reset");
const resultContainer = document.querySelector("#result-container");
let clearContainer = resultContainer.textContent;
const userInput = document.querySelector("#userInputNum");
const errorMessage = document.querySelector("#errorMessage");

// 1. HTML(input)原生驗證 2. 數字介於1-100之間。
// 以上完成之後再使用debounce概念優化輸入驗證（尚未封装）

const func = function () {
  resultContainer.textContent = "";
  if (!userInput.validity.valid) {
    userInput.value = "";
    resultContainer.textContent = "";
    errorMessage.textContent = "Please enter an integer between 1-100.";
    resultContainer.appendChild(errorMessage);
  }
};

function debounce(fn, time) {
  let timer;
  return function inner() {
    // console.log(timer);
    clearTimeout(timer);
    timer = setTimeout(fn, time);
    // console.log(timer);
  };
}

const debounced = debounce(func, 350);
userInput.addEventListener("input", debounced);

// function debounce(fn, time) {
//   let timer;
//   return {
//     execute() {
//       console.log(timer);
//       clearTimeout(timer);
//       timer = setTimeout(fn, time);
//       console.log(timer);
//     },
//   };
// }

//call back function這裡是防止debounce(func, 350).execute()直接執行，因為我們是希望當addEventListener被觸發的時候才執行。
// userInput.addEventListener("input", () => debounce(func, 1000).execute());

// 避免使用者輸入時誤提交無效的格式。
// userInput.value = ""; 這行會在驗證時就會清除輸入內容。除非很刻意不然應該很難提交一個無效的格式，就算提交也可以擋住接下來程式碼的執行（會讓使用者少一次機會猜數字）。
submit.addEventListener("click", () => {
  if (userInput.validity.valid) {
    guessNum();
  }
});

//猜數字主要邏輯：1. 太高、太低、正確。2. 以及超過10次。
const rightOrWrong = document.querySelector("#rightOrWrong");
const input = document.querySelector("#input");
const round = document.querySelector("#round");
const outOfChance = document.querySelector("#outOfChance");

function guessNum() {
  console.log(random);
  roundOfGames += 1;
  resultContainer.textContent = "";
  let number = parseInt(userInput.value);

  if (roundOfGames <= 10) {
    if (number > random) {
      round.textContent = `Round of games ${roundOfGames}`;
      input.textContent = `Your guess: ${number}`;
      rightOrWrong.textContent = "Wrong! The number was too high! ";
    } else if (number < random) {
      round.textContent = `Round of games ${roundOfGames}`;
      input.textContent = `Your guess: ${number}`;
      rightOrWrong.textContent = "Wrong! The number was too low! ";
    } else if (number === random) {
      // console.log(number);偷看一下random有沒有重新執行
      round.textContent = `Round of games ${roundOfGames}`;
      input.textContent = `Your guess: ${number}`;
      rightOrWrong.textContent = "Congratulations! You got the right answer.";
      submit.disabled = true;
      userInput.disabled = true;
    }
    resultContainer.appendChild(round);
    resultContainer.appendChild(input);
    resultContainer.appendChild(rightOrWrong);
    userInput.value = null;
  } else {
    outOfChance.textContent = "10 times! You are out of chances.";
    resultContainer.appendChild(outOfChance);
    userInput.value = null;
    submit.disabled = true;
    userInput.disabled = true;
  }
}

reset.addEventListener("click", playAgain);
//Another round
function playAgain() {
  roundOfGames = 0;
  random = rand();
  resultContainer.textContent = "";
  userInput.value = null;
  submit.disabled = false;
  userInput.disabled = false;
}
