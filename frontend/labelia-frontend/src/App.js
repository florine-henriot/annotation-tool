import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import RequireAuth from './pages/RequireAuthPage';
import DashboardPage from './pages/DashboardPage';



function App() {
  return(
    <Router>

      <Routes>

        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/dashboard" 
          element= {
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          } />

      </Routes>

    </Router>
  );
}

export default App;