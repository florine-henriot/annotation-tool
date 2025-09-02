import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import ProtectedPage from './components/protection/RequireAuth';
import DashboardPage from './pages/DashboardPage';
import AnnotationsCreate from './components/annotations/AnnotationsCreate';
import ProjectDetails from './components/project_home/ProjectHome';


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

        <Route path="/annotations/create" element={
          <ProtectedPage>
            <AnnotationsCreate />
          </ProtectedPage>
        } />

        <Route path="/annotations/:projectId" element={
          <ProtectedPage>
            <ProjectDetails />
          </ProtectedPage>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;