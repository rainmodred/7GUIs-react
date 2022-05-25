import { Routes, Route, Link } from 'react-router-dom';

import Counter from './components/Counter/Counter';
import FlightBooker from './components/FlightBooker/FlightBooker';
import TemperatureConverter from './components/TemperatureConverter/TemperatureConverter';

type Route = {
  title: string;
  path: string;
};

const routes: Route[] = [
  {
    title: 'Counter',
    path: '/counter',
  },
  {
    title: 'Temperature-converter',
    path: '/temperature-converter',
  },
  {
    title: 'Flight Booker',
    path: '/flight-booker',
  },
];

function App() {
  return (
    <div className="App">
      <ol>
        {routes.map(({ title, path }, index) => (
          <li key={index}>
            <Link to={`${path}`}>{title}</Link>
          </li>
        ))}
      </ol>
      <Routes>
        <Route path="/counter" element={<Counter />} />
        <Route
          path="/temperature-converter"
          element={<TemperatureConverter />}
        />
        <Route path="/flight-booker/" element={<FlightBooker />} />
      </Routes>
    </div>
  );
}

export default App;
