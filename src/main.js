import { Sudoku } from "./sudoku.js";

// init game
const sdk = document.querySelector(".sudoku");
const sudoku = new Sudoku(sdk);
window.sudoku = sudoku;
// await sudoku.fillRemaining(sudoku.boxes);
sudoku.newRandomSet();

const winGame = (_) => {
  const sec = Math.floor((Date.now() - sudoku.start_time.getTime()) / 1000);
  const min = Math.floor(sec / 60);

  alert(`Complete! Time taken: ${min}m ${sec}s`);
};

const clear = (e) => {
  if (e.isTrusted === false) return;
  if (e.key === "Enter") {
    if (sudoku.isValid()) {
      winGame();
    } else {
      console.warn("no");
    }
  }
  if (e.keyCode < 48 || e.keyCode > 57) return;
  if (e.ctrlKey || e.altKey) return;
  if (e.target.readOnly === true) return;
  e.target.value = e.key;
  e.target.dispatchEvent(
    new InputEvent("input", { bubbles: true, data: e.key }),
  );
};

sdk.querySelectorAll(".sudoku .cell > .value").forEach((x) => {
  // x.value = 'parseInt(Math.random() * 10);'
  x.addEventListener("keyup", clear);
});

sdk.addEventListener("input", (e) => { // check
  setTimeout((_) => {
    if (sudoku.hasDuplicatedValue()) {
      e.target.classList.add("error");
    } else {
      sdk.querySelectorAll(".error").forEach((a) => {
        a.classList.remove("error");
      });
    }
  }, 0);
});

document.querySelector("#btnCheck").addEventListener("click", function (e) {
  if (sudoku.isValid()) {
    winGame();
  } else {
    alert("board is not correct complete yet.");
  }
});

let isFilling = false;
document.querySelector("#btnAutoFill").addEventListener("click", async (e) => {
  isFilling = true;
  e.target.disabled = true;
  try {
    await sudoku.fillRemaining(sudoku.boxes);
  } catch (error) {
    alert("failed to auto fill");
  } finally {
    e.target.disabled = false;
    isFilling = false;
  }
});

document.querySelector("#btnClear").addEventListener("click", async (e) => {
  if (confirm("Clear all entered cell?")) {
    sudoku.clear();
    sdk.dispatchEvent(
      new InputEvent("input", { bubbles: true, data: e.key }),
    );
  }
});

document.querySelector("#btnEdit").addEventListener("click", (e) => {
  if (e.target["isEditing"] === "1") {
    if (confirm("Save as given?")) {
      sudoku.setCurrentAsGiven();
      e.target["isEditing"] = "0";
      e.target.innerText = "Edit";
    }
  } else {
    sudoku.setCurrentAsInput();
    e.target["isEditing"] = "1";
    e.target.innerText = "Save changes";
  }
});
