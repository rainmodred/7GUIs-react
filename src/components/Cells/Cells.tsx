import { useEffect, useRef, useState } from 'react';
import Cell from './Cell';

import styles from './Cells.module.css';
import { COLLUMNS, validateFormula, ROWS, toKey } from './utils';

interface ICell {
  value: string;
  formula: string;
}

export default function Cells() {
  const [cells, setCells] = useState<{ [key: string]: ICell }>({});
  const isCellUpdated = useRef(false);

  useEffect(() => {
    if (isCellUpdated.current) {
      const updatedCells = Object.fromEntries(
        Object.entries(cells).map(([key, cell]) => {
          if (cell.formula.startsWith('=')) {
            return [
              key,
              { value: calculateValue(cell.formula), formula: cell.formula },
            ];
          }

          return [key, cell];
        }),
      );
      setCells({
        ...updatedCells,
      });
      isCellUpdated.current = false;
    }
  }, [cells]);

  function handleCellValueChange(key: string, value: string) {
    setCells({
      ...cells,
      [key]: {
        value,
        formula: '',
      },
    });
    isCellUpdated.current = true;
  }

  function calculateValue(formula: string) {
    const res = validateFormula(formula);

    if (res) {
      const { fn, numbers, cellKeys } = res;

      const cellValues = [];
      if (cellKeys.length > 0) {
        for (const cellKey of cellKeys) {
          const { value } = cells[cellKey] ?? '';
          const maybeNumber = Number(value);
          if (typeof maybeNumber === 'number' && !isNaN(maybeNumber)) {
            cellValues.push(maybeNumber);
          }
        }
      }
      const result = fn(...numbers.concat(cellValues));
      return result.toString();
    } else {
      return 'error';
    }
  }

  function handleCellFormulaChange(key: string, formula: string) {
    const result = calculateValue(formula);
    if (result !== 'error') {
      setCells({
        ...cells,
        [key]: {
          value: result.toString(),
          formula,
        },
      });
    } else {
      setCells({
        ...cells,
        [key]: {
          value: 'error',
          formula,
        },
      });
    }
  }

  return (
    <div>
      <h2>Cells</h2>
      <table className={styles.table}>
        <tbody>
          <tr className={styles.header}>
            <th></th>
            {COLLUMNS.split('').map(label => {
              return <th key={`th-${label}`}>{label}</th>;
            })}
          </tr>

          {ROWS.map((rowLabel, rowIndex) => {
            return (
              <tr key={`tr-${rowLabel}`}>
                <th>{rowLabel}</th>
                {COLLUMNS.split('').map((colLabel, colIndex) => {
                  const key = toKey(rowIndex, colIndex);
                  const cell = cells[key];

                  return (
                    <Cell
                      id={key}
                      key={key}
                      value={cell?.value ?? ''}
                      formula={cell?.formula ?? ''}
                      onValueChange={value => handleCellValueChange(key, value)}
                      onFormulaChange={value =>
                        handleCellFormulaChange(key, value)
                      }
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
