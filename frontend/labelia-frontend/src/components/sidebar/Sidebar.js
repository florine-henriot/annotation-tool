import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosClient from "../../api/axiosClient"
import { PieChart, NotebookPen, Users, Download, FilePlus, File } from 'lucide-react';
import './Sidebar.css'

function SideBar() {
    const [projects, setProjets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get("/dashboard", {withCredentials: true})
        .then(res => {
            if (res.data.has_projects) {
                setProjets(res.data.projects);
            } else {
                setProjets([]);
            }
        })
        .catch(err => console.error("Erreur récupération projets :", err))
    }, []);

    return (
        <div className='sidebar'>
            <nav className='sidebar-nav'>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-button active": "nav-button"}>
                    <PieChart size={18} style={{marginRight:"10px"}} />
                    Tableau de bord
                </NavLink>
                <NavLink to="/annotations" className={({ isActive }) => isActive ? "nav-button active": "nav-button"}>
                    <NotebookPen size={18} style={{marginRight:"10px"}} />
                    Annotations
                </NavLink>

                {/* Boutons pour chaque projet */}
                {projects.length > 0 && projects.map(project => (
                    <button 
                    key={project.id}
                    className='nav-button add-project'
                    onClick={() => navigate(`/annotations/${project.id}`)}>
                        <File size={18} style={{marginRight: "8px"}} />
                        {project.project_name}
                    </button>
                ))}

                <button className='nav-button add-project'
                onClick={() => navigate("/annotations/create")}
                >
                    <FilePlus size={18} style={{marginRight: "8px"}} />
                    Ajouter 
                </button>
                <NavLink to="/team" className={({ isActive }) => isActive ? "nav-button active": "nav-button"}>
                    <Users size={18} style={{marginRight:"10px"}} />
                    Mon équipe
                </NavLink>
                <NavLink to="/download" className={({ isActive }) => isActive ? "nav-button active": "nav-button"}>
                    <Download size={18} style={{marginRight:"10px"}} />
                    Exporter
                </NavLink>
            </nav>
        </div>
    );
}

export default SideBar;