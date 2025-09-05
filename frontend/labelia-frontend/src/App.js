import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/LoginPage';
import Signup from './components/pages/SignupPage';


function App() {
  return(
    <Router>

      <Routes>

        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>

      </Routes>

    </Router>
  );
}

export default App;