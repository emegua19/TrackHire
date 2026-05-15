import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
//import Dashboard from "./pages/Dashboard";
//import Applications from "./pages/Applications";
//import AddApplication from "./pages/AddApplication";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />    
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/applications" element={<Applications />} /> */}
        {/* <Route path="/applications/add" element={<AddApplication />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;