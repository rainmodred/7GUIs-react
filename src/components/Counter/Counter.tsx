import { useState } from 'react';
import styles from './Counter.module.css';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h3>Counter</h3>
      <div className={styles.counter}>
        <span>{count}</span>
        <button type="button" onClick={() => setCount(count => count + 1)}>
          count
        </button>
      </div>
    </div>
  );
}
