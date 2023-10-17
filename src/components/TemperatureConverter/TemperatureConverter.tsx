import { useState } from 'react';
import { convertToCeilcius, convertToFahrenheit } from './convert';

export default function TemperatureConverter() {
  const [state, setState] = useState({ celcius: '', fahrenheit: '' });

  function handleCelciusChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setState({
      celcius: value,
      fahrenheit: convertToFahrenheit(value),
    });
  }

  function handleFahrenheitChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setState({
      celcius: convertToCeilcius(value) ?? '',
      fahrenheit: value,
    });
  }

  const { celcius, fahrenheit } = state;

  return (
    <div>
      <h3>Temperature Converter</h3>
      <div>
        <input
          name="celcius"
          id="celcius"
          type="number"
          onChange={handleCelciusChange}
          value={celcius ?? ''}
        />
        <label htmlFor="celcius">Celcius</label>
        <input
          name="fahrenheit"
          id="fahrenheit"
          type="number"
          onChange={handleFahrenheitChange}
          value={fahrenheit}
        />
        <label htmlFor="fahrenheit">Fahrenheit</label>
      </div>
    </div>
  );
}
