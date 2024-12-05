export class Sudoku {
    boxes = [null, null, null, null, null, null, null, null, null];
    row_s = [null, null, null, null, null, null, null, null, null];
    column_s = [null, null, null, null, null, null, null, null, null];

    start_time = new Date();
    constructor(sudokuElem) {
        for (const i in this.boxes) {
            const B = sudokuElem.querySelectorAll(".box");
            this.boxes[i] = new Box(
                B[i].querySelectorAll(".value"),
            );
        }
        let len = this.row_s.length;
        for (let i = 0; i < len; ++i) {
            this.row_s[i] = new Row(
                sudokuElem.querySelectorAll(`.cell.r${i + 1}  .value`),
            );
        }
        len = this.column_s.length;
        for (let i = 0; i < len; ++i) {
            this.column_s[i] = new Column(
                sudokuElem.querySelectorAll(`.cell.c${i + 1}  .value`),
            );
        }
    }

    setGivenDigit(cell, digit) {
        cell.value = digit;
        cell.readOnly = true;
    }

    removeGivenDigit(cell) {
        cell.value = "";
        cell.readOnly = false;
    }

    _generateRandomInt(smallest, highest) {
        const numbers = [];
        for (let i = smallest; i <= highest; ++i) {
            numbers.push(i);
        }
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers;
    }

    async newRandomSet() {
        let a = this._generateRandomInt(0, 8)[0];
        let randomDigitList = this._generateRandomInt(1, 9);
        for (let i = 8; i >= 0; --i) {
            this.setGivenDigit(
                this.boxes[a].Cells[i],
                randomDigitList.pop(),
            );
        }
        await this._fillRemaining(this.boxes, async () => null);

        const len = this.boxes.length;
        for (a = 0; a < len; ++a) {
            const missingSlotCount = (parseInt(Math.random() * 10) % 9) + 1;
            for (let i = 0; i < missingSlotCount; ++i) {
                randomDigitList = this._generateRandomInt(0, 8);
                this.removeGivenDigit(
                    this.boxes[a].Cells[randomDigitList.pop()],
                );
            }
        }
        this._setCurrentAsGiven();
    }

    _setCurrentAsGiven() {
        let len = this.boxes.length;
        for (let i = 0; i < len; ++i) {
            this.boxes[i].Cells.forEach((x) => {
                if (x.value !== "") {
                    x.readOnly = true;
                }
            });
        }
        len = this.row_s.length;
        for (let i = 0; i < len; ++i) {
            this.row_s[i].Cells.forEach((x) => {
                if (x.value !== "") {
                    x.readOnly = true;
                }
            });
        }
        len = this.column_s.length;
        for (let i = 0; i < len; ++i) {
            this.column_s[i].Cells.forEach((x) => {
                if (x.value !== "") {
                    x.readOnly = true;
                }
            });
        }
    }

    fillRemaining(dimension_s) {
        return this._fillRemaining(
            dimension_s,
            () => new Promise((r) => setTimeout(r, 20)),
        );
    }

    async _fillRemaining(dimension_s, mainToRun) {
        let isToBackTrack = false;
        let i_c = 9 - 1;
        for (let i_d = dimension_s.length - 1; i_d >= 0;) {
            const Cells = dimension_s[i_d].Cells;
            if (i_c < 0) i_c = Cells.length - 1;
            for (; i_c >= 0;) {
                const cell = Cells[i_c];
                if (cell.readOnly !== true) {
                    for (let d = parseInt(cell.value || 0) + 1; d < 10; d++) {
                        cell.value = d;
                        isToBackTrack = this.hasDuplicatedValue();
                        if (isToBackTrack === false) {
                            break;
                        }
                    }
                    await mainToRun();
                }
                if (isToBackTrack) { // backtrack
                    if (cell.readOnly !== true) cell.value = "";
                    ++i_c;
                    await mainToRun();
                    if (i_c >= Cells.length) {
                        break;
                    }
                } else { // advance
                    --i_c;
                }
            }

            if (isToBackTrack) { // backtrack
                ++i_d;
                i_c = 0;
                if (i_d >= dimension_s.length) {
                    break;
                }
            } else { // advance
                --i_d;
            }
        }
        if (isToBackTrack) {
            throw new Error(
                "fail filling, all possible combination is exhausted",
            );
        }
    }

    isValid() {
        for (const b of this.boxes) {
            if (b.isValid() === false) return false;
        }
        for (const c of this.column_s) {
            if (c.isValid() === false) return false;
        }
        for (const r of this.row_s) {
            if (r.isValid() === false) return false;
        }
        return true;
    }

    hasDuplicatedValue() {
        for (const b of this.boxes) {
            if (b.hasDuplicatedValue() === true) return true;
        }
        for (const c of this.column_s) {
            if (c.hasDuplicatedValue() === true) return true;
        }
        for (const r of this.row_s) {
            if (r.hasDuplicatedValue() === true) return true;
        }
        return false;
    }

    clear() {
        for (const b of this.boxes) {
            b.Cells.forEach((x) => {
                if (x.readOnly !== true) x.value = "";
            });
        }
        for (const c of this.column_s) {
            c.Cells.forEach((x) => {
                if (x.readOnly !== true) x.value = "";
            });
        }
        for (const r of this.row_s) {
            r.Cells.forEach((x) => {
                if (x.readOnly !== true) x.value = "";
            });
        }
    }
}

class Dimension {
    Cells = [];
    constructor(cellValue_list) {
        // cellValue_list.forEach((x) => {
        //     const c = new Cell(x);
        //     this.Cells.push(c);
        // });
        this.Cells = cellValue_list;
    }
    isValid() {
        const seenIndex = [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ];
        for (const c of this.Cells) {
            const digit = c.value;
            if (seenIndex[digit] !== false) return false;
            seenIndex[digit] = true;
        }
        for (const isSeen of seenIndex) {
            if (isSeen === false) return false;
        }
        return true;
    }
    hasDuplicatedValue() {
        const seenIndex = ["0"];
        for (const c of this.Cells) {
            const digit = c.value;
            if (!digit) continue;
            if (seenIndex[digit] === digit) {
                return true;
            }
            seenIndex[digit] = digit;
        }
        return false;
    }
}

class Box extends Dimension {
    constructor(cellValue_list) {
        super(cellValue_list);
        this.Cells.forEach((x) => {
            x.box = this;
        });
    }
}

class Row extends Dimension {
    constructor(cellValue_list) {
        super(cellValue_list);
        this.Cells.forEach((x) => {
            x.column = this;
        });
    }
}

class Column extends Dimension {
    constructor(cellValue_list) {
        super(cellValue_list);
        this.Cells.forEach((x) => {
            x.row = this;
        });
    }
}

class Cell {
    box = null;
    column = null;
    row = null;
    elem = null;
    constructor(elem) {
        this.elem = elem;
        elem.addEventListener("input", (e) => {
            this.isValid();
        });
    }
    get value() {
        return this.elem.value;
    }
    set value(digit) {
        console.log(digit);
        this.elem.value = digit;
    }
    isValid() {
        if (this.box.isValid() === false) return false;
        if (this.column.isValid() === false) return false;
        if (this.row.isValid() === false) return false;

        return true;
    }
}
