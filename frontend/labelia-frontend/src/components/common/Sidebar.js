import React from "react";
import { PieChart, NotebookPen, Users, Download, FilePlus, File, X } from 'lucide-react';
import { NavLink } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../../App.css";
import './Sidebar.css';

/**
 * Sidebar
 * 
 * Barre latérale de navigation de l'application, permettant d'accéder au tableau de bord,
 * aux projets, à la création de projet, à l'équipe et à l'exportation des données.
 * 
 * Les projets de l'utilisateur sont récupérés dynamiquement depuis l'API
 * ('/dashboard') et affichés dans la section "Mes projets".
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Indique si la sidebar est ouverte (true) ou fermée (false)
 * @param {function} props.onClose - Fonction appelée pour fermer la sidebar (utile en mobile).
 *  
 * @returns {JSX.Element} La barre latérale de navigation.
 */

export default function Sidebar({ isOpen, onClose }) {
  // List des projets de l'utilisateur.
  const [projects, setProjects] = React.useState([]);

  // Récupération des projets depuis l'API au montage du composant
  React.useEffect(() => {
    axiosClient.get("/dashboard", { withCredentials: true })
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
    <>
      {/* Overlay cliquable pour fermer la sidebar en mode mobile */}
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        {/* Bouton de fermeture (mobile uniquement) */}
        <button className="close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        {/* Lien vers le tableau de bord */}
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-button active": "nav-button"}>
          <span><PieChart size={18} /></span>
          <span>Dashboard</span>
        </NavLink>

        {/* Section mes projets */}
        <div className='nav-button'>
          <span><NotebookPen size={18} /></span>
          <span>Mes projets</span>
        </div>

        {/* Liste dynamique des projets */}
        {projects.length > 0 && projects.map(project => (
          <NavLink key={project.id} to={`/annotations/${project.id}`} 
            className={({isActive}) => isActive ? "nav-button small-right active": "nav-button small-right"}>
            <span><File size={18} /></span>
            <span>{project.project_name}</span>
          </NavLink>
        ))}

        {/* Lien pour créer un projet */}
        <NavLink to="/annotations/create" className={({isActive}) => isActive ? "nav-button small-right active": "nav-button small-right"}>
          <span><FilePlus size={18} /></span>
          <span>Ajouter</span>
        </NavLink>

        {/* Lien vers l'équipe
        <NavLink to="/team" className={({isActive}) => isActive ? "nav-button active": "nav-button"}>
          <span><Users size={18} /></span>
          <span>Mon équipe</span>
        </NavLink> */}

        {/* Lien vers l'exportation */}
        <NavLink to="/export" className={({isActive}) => isActive ? "nav-button active": "nav-button"}>
          <span><Download size={18} /></span>
          <span>Exporter</span> 
        </NavLink>
      </div>
    </>
  )
}