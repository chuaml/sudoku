import { Sudoku } from "./sudoku.js";

const clear = (e) => {
  if (e.isTrusted === false) return;
  if (e.keyCode < 48 || e.keyCode > 57) return;
  if (e.ctrlKey || e.altKey) return;
  if (e.target.readOnly === true) return;
  console.log(e);
  e.target.value = e.key;
};
document.querySelectorAll(".sudoku .cell > .value").forEach((x) => {
  // x.value = 'parseInt(Math.random() * 10);'
  x.addEventListener("keydown", clear);
});

window.sudoku = new Sudoku(document.querySelector(".sudoku"));
// await sudoku.fillRemaining(sudoku.boxes);
sudoku.newRandomSet();
