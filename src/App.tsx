import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Terminal from './pages/terminal';

function App() {
  return (
    <Router>
      <Routes>
        {/* Tutaj definiujemy ścieżki do podstron */}
        <Route path="/" element={<Home />} />
        <Route path="/terminal" element={<Terminal />} />
      </Routes>
    </Router>
  );
}

export default App;