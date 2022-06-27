import { Routes, Route, Link } from 'react-router-dom';

import Counter from './components/Counter/Counter';
import CRUD from './components/CRUD/CRUD';
import FlightBooker from './components/FlightBooker/FlightBooker';
import TemperatureConverter from './components/TemperatureConverter/TemperatureConverter';
import Timer from './components/Timer/Timer';
import CircleDrawer from './components/CircleDrawer/CircleDrawer';

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
  {
    title: 'Timer',
    path: '/Timer',
  },
  {
    title: 'CRUD',
    path: '/CRUD',
  },
  { title: 'Circle Drawer', path: '/Circle-Drawer' },
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
        <Route path="/Timer" element={<Timer />} />
        <Route path="/CRUD" element={<CRUD />} />
        <Route path="/Circle-Drawer" element={<CircleDrawer />} />
      </Routes>
    </div>
  );
}

export default App;
