import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../topbar/TopBar';
import SideBar from '../sidebar/Sidebar';
import SidebarFooter from '../sidebar_footer/SidebarFooter';
import axiosClient from '../../api/axiosClient';
import './DashboardEmpty.css'; // tu peux créer un DashboardNotEmpty.css si tu veux séparer
import { FilePlus, Trash2 } from 'lucide-react';

function DashboardNotEmpty() {
    const [projects, setProjects] = useState([]);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get("/dashboard")
            .then(res => {
                if (res.data.has_projects) {
                    setProjects(res.data.projects);
                } else {
                    setProjects([]);
                }
            })
            .catch(err => console.error("Erreur récupération projets :", err));
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return '#F59E0B';
            case 'completed': return '#10B981';
            case 'archived': return '#6B7280';
            default: return '#9CA3AF';
        }
    };

    const handleDelete = async () => {
        try {
            await axiosClient.delete(`/dashboard/annotations/${projectToDelete.id}`);
            setProjects(projects.filter(p => p.id !== projectToDelete.id));
            setProjectToDelete(null);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    }

    return (
        <div className='dashboard-container'>
            <TopBar pageTitle="Tableau de bord" />
            <SideBar />
            <SidebarFooter />
            <div className='dashboard-page'>
                <div className="dashboard-card">
                    <h2 className='project-title'>
                        MES PROJETS D'ANNOTATIONS
                    </h2>
                    {projects.length > 0 ? (
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Projet</th>
                                    <th>Date d'échéance</th>
                                    <th>Status</th>
                                    <th>Complétion</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id} onClick={() => navigate(`/annotations/${project.id}`)} style={{ cursor: 'pointer' }}>
                                        <td>{project.project_name}</td>
                                        <td>{new Date(project.due_date).toLocaleDateString()}</td>
                                        <td>
                                            <span 
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(project.status) }}
                                            >
                                                {project.status === "pending" ? "En cours" :
                                                 project.status === "completed" ? "Terminé" :
                                                 project.status === "archived" ? "Archivé" : project.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ width: `${project.completion || 0}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                            className="delete-btn"
                                            onClick={(e) => {
                                            e.stopPropagation();
                                            setProjectToDelete(project);}}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <span></span>
                    )}

                    <button className='add-project-btn' onClick={() => navigate("/annotations/create")}>
                                            <FilePlus size={18} style={{marginRight: "8px"}}/>
                                            CRÉER UN PROJET
                    </button>

                    {projectToDelete && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <p>Voulez-vous vraiment supprimer ce projet ?</p>
                                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-around" }}>
                                    <button 
                                    className='popup-button-delete'
                                    onClick={handleDelete}>SUPPRIMER</button>
                                    <button 
                                    className='popup-button-cancel'
                                    onClick={() => setProjectToDelete(null)}>ANNULER</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardNotEmpty;