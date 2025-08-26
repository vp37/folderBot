import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Enbot from "./pages/Enbot";
import Folder from "./pages/Folder"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Default path -> Enbot */}
        <Route path="/" element={<Enbot />} />

        {/* Example: neenga in future folder page add panna */}
        <Route path="/folder" element={<Folder />} />
      </Routes>
    </Router>
  );
}

export default App;
