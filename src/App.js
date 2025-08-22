import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./Pages/Quiz.jsx";
import Auth from "./Pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
