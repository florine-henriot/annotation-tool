import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import RequireAuth from './pages/RequireAuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectCreationPage from './pages/ProjetCreationPage';
import ProjectHomePage from './pages/ProjectHomePage';
import AnnotationsPage from './pages/AnnotationsPage';



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
        <Route path="/annotations/create"
          element= {
            <RequireAuth>
              <ProjectCreationPage />
            </RequireAuth>
          }
        />
        <Route path="/annotations/:projectId" 
          element = {
            <RequireAuth>
              <ProjectHomePage />
            </RequireAuth>
          }
        />
        <Route path="/annotations/:projectId/annotate"
          element = {
            <RequireAuth>
              <AnnotationsPage />
            </RequireAuth>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;