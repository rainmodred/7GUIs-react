const COLLUMNS = 'ABCDEFGHIJKLMNOPQRSTUWXYZ';

const ROWS = Array.from({ length: 100 }, (_, index) => index);

const formulasList: { [key: string]: (...args: number[]) => number } = {
  sum: (...args) => args.reduce((prev, curr) => prev + curr, 0),
  add: (x = 0, y = 0) => x + y,
};

function toKey(row: number, col: number) {
  return `${COLLUMNS[col]}${row}`;
}

//TODO: refactor
function validateFormula(formula: string) {
  if (!formula) {
    return null;
  }
  const re = /^=(\w+)\((.+)\)$/;
  //TODO: not working with extra parentheses
  // =sum((1,2))
  const res = formula.match(re);
  if (!res) {
    return null;
  }

  const [, formulaName, values] = res;
  const fn = formulasList[formulaName];
  if (!fn) {
    return null;
  }

  const items = values.split(',').map(item => {
    const parsedValue = parseInt(item);
    if (Number.isInteger(parsedValue)) {
      return parsedValue;
    }
    return item;
  });

  const numbers: number[] = [];
  let cellKeys: string[] = [];
  for (const item of items) {
    if (typeof item === 'number') {
      numbers.push(item);
    } else if (typeof item === 'string') {
      const cell = item.includes(':') ? getCellsInRange(item) : item;
      cellKeys = cellKeys.concat(cell);
    }
  }

  return { fn, numbers, cellKeys };
}

function getCellsInRange(range: string) {
  const [start, end] = range.split(':').map(key => getCellCoords(key));

  const xDiff = Math.abs(start.x - end.x);
  const yDiff = Math.abs(start.y - end.y);

  const startCol = start.x < end.x ? start.x : end.x;
  const startRow = start.y < end.y ? start.y : end.y;

  const res = [];
  for (let i = startRow; i <= startRow + yDiff; i++) {
    for (let j = startCol; j <= startCol + xDiff; j++) {
      res.push(toKey(j, i));
    }
  }
  return res;
}

function getCellCoords(key: string) {
  const [colLabel, row] = key.split(/(?<=\D)(?=\d)/);
  const col = COLLUMNS.indexOf(colLabel);

  return { x: Number(row), y: col };
}

export { COLLUMNS, ROWS, toKey, validateFormula, getCellsInRange };
