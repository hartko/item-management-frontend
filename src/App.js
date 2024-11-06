import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ItemList from './pages/item/List';

function App() {
  return (
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/list" element={<ItemList />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
