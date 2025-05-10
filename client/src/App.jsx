import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import EditTask from "./pages/EditTask";
import CreateTask from "./pages/CreateTask";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="edit-task/:id" element={<EditTask />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/create-task" element={<CreateTask />} />
      </Routes>
    </Router>
  );
}

export default App;
