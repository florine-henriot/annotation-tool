import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Dashboard from './pages/DashboardPage';
import ProtectedPage from './components/protection/RequireAuth';
import DashboardPage from './pages/DashboardPage';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedPage>
            <DashboardPage />
          </ProtectedPage>
        } />
      </Routes>
    </Router>
  );
}

export default App;