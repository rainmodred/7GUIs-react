import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h3>Counter</h3>
      <span>{count}</span>
      <button type="button" onClick={() => setCount(count => count + 1)}>
        count
      </button>
    </div>
  );
}
