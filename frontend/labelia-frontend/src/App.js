import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedPage from './components/protection/RequireAuth';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedPage>
            <Dashboard />
          </ProtectedPage>
        } />
      </Routes>
    </Router>
  );
}

export default App;