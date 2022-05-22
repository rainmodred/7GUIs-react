import { Routes, Route, Link } from 'react-router-dom';

import Counter from './components/Counter/Counter';
import TemperatureConverter from './components/TemperatureConverter/TemperatureConverter';

function App() {
  return (
    <div className="App">
      <ol>
        <li>
          <Link to="/counter">Counter</Link>
        </li>
        <li>
          <Link to="/temperature-converter">Temperature-converter</Link>
        </li>
      </ol>
      <Routes>
        <Route path="/counter" element={<Counter />} />
        <Route
          path="/temperature-converter"
          element={<TemperatureConverter />}
        />
      </Routes>
    </div>
  );
}

export default App;
