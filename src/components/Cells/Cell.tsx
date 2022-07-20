import { useEffect, useMemo, useRef, useState } from 'react';

interface CellProps {
  id: string;
  value: string;
  formula: string;
  onValueChange: (value: string) => void;
  onFormulaChange: (value: string) => void;
}

export default function Cell({
  id,
  value,
  formula,
  onValueChange,
  onFormulaChange,
}: CellProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isChanged = useRef(false);

  useEffect(() => {
    setCurrentValue(inputRef.current?.focus ? value : formula);
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentValue(e.target.value);
    isChanged.current = true;
  }

  function handleBlur() {
    if (isChanged) {
      if (currentValue.startsWith('=')) {
        onFormulaChange(currentValue);
      } else {
        onValueChange(currentValue);
      }
    }
    setCurrentValue(value);
  }

  function handleFocus() {
    if (formula.startsWith('=')) {
      setCurrentValue(formula);
    } else {
      setCurrentValue(value);
    }
  }

  return (
    <td>
      <input
        data-testid={id}
        value={currentValue}
        onChange={handleChange}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </td>
  );
}
