import { useState } from 'react';

import styles from './FlightBooker.module.css';

const options = [
  { name: 'one-way flight', value: 'one-way' },
  { name: 'return flight', value: 'return' },
];

export default function FlightBooker() {
  const [selectedValue, setSelectedValue] = useState('one-way');
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [returnDate, setReturnDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedValue(e.target.value);
  }

  function handleDepartureDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDepartureDate(e.target.value);
  }
  function handleReturnDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReturnDate(e.target.value);
  }

  function handleBook() {
    console.log('do something');
  }

  const isReturnDateDisabled = selectedValue === 'one-way';
  const isBookDisabled =
    new Date(returnDate).getTime() < new Date(departureDate).getTime();

  return (
    <div className={styles.wrapper}>
      <div>Flight Booker</div>
      <select value={selectedValue} onChange={handleChange}>
        {options.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
      <label htmlFor="departure date">Departure Date</label>
      <input
        name="departure date"
        id="departure date"
        type="date"
        value={departureDate}
        onChange={handleDepartureDateChange}
      />
      <label htmlFor="return date">Return Date</label>
      <input
        disabled={isReturnDateDisabled}
        name="return date"
        id="return date"
        type="date"
        value={returnDate}
        onChange={handleReturnDateChange}
      />

      <button onClick={handleBook} disabled={isBookDisabled}>
        Book
      </button>
    </div>
  );
}
