import React from "react";
import { PieChart, NotebookPen, Users, Download, FilePlus, File } from 'lucide-react';
import { NavLink } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../../App.css";
import './Sidebar.css';


export default function Sidebar() {

    const [projects, setProjects] = React.useState([]);

    React.useEffect(() => {
        axiosClient.get("/dashboard", {withCredentials: true})
        .then(res => {
            if (res.data.has_projects) {
                setProjects(res.data.projects);
            } else {
                setProjects([]);
            }
        })
        .catch(err =>
            console.error("Erreur récupération projets :", err)
        )
    }, []);

    return (
        <div className="sidebar">

            <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-button active": "nav-button"}>
                <span>
                    <PieChart size={18} />
                </span>
                <span>
                    Dashboard
                </span>
            </NavLink>

            <div className='nav-button'>
                <span>
                    <NotebookPen size={18} />
                </span>
                <span>
                    Mes projets
                </span>
            </div>

            {/* Bouton pour chaque projet */}
            {projects.length > 0 && projects.map(project => (
                <NavLink to={`/annotations/${project.id}`} className={({isActive}) => isActive ? "nav-button active": "nav-button small-right"}>
                    <span>
                        <File size={18} />
                    </span>
                    <span>
                        {project.project_name}
                    </span>
                </NavLink>
            ))}

            <NavLink to="/annotations/create" className={({isActive}) => isActive ? "nav-button active": "nav-button small-right"}>
                <span>
                    <FilePlus size={18} />
                </span>
                <span>
                    Ajouter
                </span>
            </NavLink>

            <NavLink to="/team" className={({isActive}) => isActive ? "nav-button active": "nav-button"}>
                <span>
                    <Users size={18} />
                </span>
                <span>
                    Mon équipe
                </span>
            </NavLink>

            <NavLink to="/export" className={({isActive}) => isActive ? "nav-button active": "nav-button"}>
                <span>
                    <Download size={18} />
                </span>
                <span>
                    Exporter
                </span> 
            </NavLink>
            
        </div>
    )
}