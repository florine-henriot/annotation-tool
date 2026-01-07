import React from "react";
import "../../App.css";
import "./Dashboard.css";
import { FilePlus, Trash2, Download } from 'lucide-react';
import axiosClient from "../api/axiosClient";
import { NavLink, useNavigate } from "react-router-dom";
import Popup from "../common/Popup";

/**
 * DashboardNotEmpty
 * 
 * Ce composant affiche la liste des projets d'annotation existants sous forme de tableau.
 * Il propose : 
 * - Un tableau listant les projets avec : nom, d'ate d'échéance, statut et progression
 * - Un bouton pour supprimer un projet (avec popup de confirmation)
 * - Un bouton pour créer un nouveau projet.
 * 
 * Logique principale : 
 * - Récupère les projets depuis l'API "/dashboard" au montage 
 * - Met à jour dynamiquement la liste en cas de suppression
 * - Gère un état "projectToDelete" pour afficher une popup avant suppression
 * 
 * @returns {JSX.Element} Une carte avec tableau des projets et actions associées
 */

export default function DashboardNotEmpty() {
    const [showTooltip, setShowTooltip] = React.useState(false);
    // Liste des projets récupérés
    const [projects, setProjects] = React.useState([]);
    // Projet sélectionné pour suppression
    const [projectToDelete, setProjectToDelete] = React.useState(null);

    const navigate = useNavigate();

    // Chargement initial des projets depuis l'API
    React.useEffect(() => {
        axiosClient.get("/dashboard")
        .then(res => {
            if (res.data.has_projects) {
                setProjects(res.data.projects);
            } else {
                setProjects([]);
            }
        })
        .catch(err => console.error("Erreur de récupération projets :", err));
    }, []);

    /**
     * Retourne une couleur correspondant au statut du projet
     * @param {string} status - Le statut du projet
     * 
     * @returns {string} Une couleur en hexadécimal
     */
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return "#F59E0B"; // orange
            case 'completed': return "#10B981"; // vert
            case 'archived': return "#6B7280"; // gris foncé
            default: return "#9CA3AF"; // gris clair
        }
    };

    /**
     * Télécharger le fichier d'annotation du projet avec les annotations de la base 
     * de données ajoutées au fichier CSV.
     */
    const handleExport = async (project) => {
        try {
            const response = await axiosClient.get(`/dashboard/annotations/${project.id}/export`, {
                responseType: 'blob',
            });

            // Créer un lien de téléchargement temporaire
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `projet_${project.id}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Erreur lors de l'export :", err.response?.data || err.message);
        }
    }

    /**
     * Supprime définitivement un projet via l'API puis met à jour la list localement.
     */
    const handleDelete = async () => {
        try {
            await axiosClient.delete(`/dashboard/annotations/${projectToDelete.id}`);
            setProjects(projects.filter(p => p.id !== projectToDelete.id));
            setProjectToDelete(null);
        } catch (err) {
            console.error(err.reponse?.data || err.message);
        }
    }

    return (
        <div className="card dashboard-card">
            
            <h2 className="dashboard-title">
                Mes projets d'annotation
            </h2>

            {projects.length > 0 ? (
                <table className="dashboard-table">
                    <thead>
                        <th>Projet</th>
                        <th>Date d'échéance</th>
                        <th>Status</th>
                        <th>Complétion</th>
                        <th>Action</th>
                    </thead>
                    <tbody>

                        {projects.map((project) => (
                            <tr key={project.id} onClick={() => navigate(`/annotations/${project.id}`)} style={{cursor: 'pointer'}}>

                                <td>{project.project_name}</td>

                                <td>{new Date(project.due_date).toLocaleDateString()}</td>

                                <td>
                                    <span className="status-badge" style={{backgroundColor: getStatusColor(project.status)}}>
                                        {project.status === "pending" ? "En cours" :
                                        project.status === "completed" ? "Terminé" :
                                        project.status === "archived" ? "Archivé" : project.status}
                                    </span>
                                </td>

                                <td>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${project.completion || 0}%` }}>

                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className="tooltip-wrapper">
                                        <button className="export-btn"
                                            onClick={(e) => {e.stopPropagation(); handleExport(project);}}
                                            onMouseEnter={() => setShowTooltip(true)}
                                            onMouseLeave={() => setShowTooltip(false)}>
                                                <Download size={18} />
                                        </button>
                                        <span className="tooltip-info">
                                            Exporter les annotations
                                        </span>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {e.stopPropagation(); setProjectToDelete(project);}}>
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

            {/* {showTooltip && <span className="tooltip-info">
                Exporter les annotations
            </span>} */}

            <NavLink to="/annotations/create" className="add-project-button">

                <FilePlus size={18} />
                Créer un projet

            </NavLink>

            {projectToDelete && (
                <Popup onClose={() => setProjectToDelete(null)}>
                    <p className="text">Voulez-vous vraiment supprimer ce projet ?</p>
                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-around", gap: "10px" }}>
                        <button className="popup-button-delete" onClick={handleDelete}>SUPPRIMER</button>
                        <button className="popup-button-cancel" onClick={() => setProjectToDelete(null)}>ANNULER</button>
                    </div>
                </Popup>
            )}

        </div>
    )
}