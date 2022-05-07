import { Routes, Route, Link } from 'react-router-dom';

import Counter from './components/Counter/Counter';

function App() {
  return (
    <div className="App">
      <ol>
        <li>
          <Link to="/counter">Counter</Link>
        </li>
      </ol>
      <Routes>
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </div>
  );
}

export default App;
