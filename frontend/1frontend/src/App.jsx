import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/auth/register.jsx';
import Login from './components/auth/login.jsx'
import ProviderDashboard from './components/provider/providerDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* Add this */}
        <Route path="/" element={<Login />} /> {/* Change to Login as default */}
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
