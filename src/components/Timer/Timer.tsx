import { useEffect, useRef, useState } from 'react';

import styles from './Timer.module.css';

function formatTime(value: number) {
  const res = value / 1000;
  const str = res.toString().split('.');
  if (str.length === 1) {
    str.push('0');
  }

  return `${str.join('.')}s`;
}

export default function Timer() {
  const [duration, setDuration] = useState('30000');
  const [time, setTime] = useState(0);
  const timerId = useRef(0);

  useEffect(() => {
    if (Number(duration) > time) {
      timerId.current = window.setInterval(() => {
        setTime(time => time + 100);
      }, 100);
    }

    return () => {
      window.clearInterval(timerId.current);
    };
  }, [duration]);

  useEffect(() => {
    if (time >= Number(duration)) {
      window.clearInterval(timerId.current);
    }
  }, [time]);

  function handleReset() {
    setTime(0);
  }

  const elapsedTime = (time / parseInt(duration)) * 100;

  return (
    <div className={styles.wrapper}>
      <h3>Timer</h3>
      <label className={styles.verticalCenter}>
        Elapsed Time:
        <progress max="100" value={elapsedTime}></progress>
      </label>
      <p>{formatTime(time)}</p>
      <label className={styles.verticalCenter}>
        Duration:{' '}
        <input
          type="range"
          value={duration}
          min="0"
          max="120000"
          step="1000"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDuration(e.target.value)
          }
        />
      </label>
      <button className={styles.button} onClick={handleReset}>
        Reset timer
      </button>
    </div>
  );
}
