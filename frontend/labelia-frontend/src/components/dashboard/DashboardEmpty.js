import { FilePlus } from 'lucide-react';
import { NavLink } from "react-router-dom";
import "../../App.css";
import "./Dashboard.css";

/**
 * DashboardEmpty
 * 
 * Ce composant est affiché lorsqu'aucun projet d'annotation n'existe encore.
 * Il sert de "placeholder" dans le tableau de bord et propose : 
 * - Un titre
 * - Un message indiquant l'absence de projets
 * - Un bouton permettant de créer un nouveau projet
 * 
 * @returns {JSX.Element} Une carte vide avec un message et un bouton de création de projet.
 */

export default function DashboardEmpty() {
    return (
        <div className="card dashboard-card">
            <h2 className="dashboard-title">
                Mes projets d'annotation
            </h2>

            <span className="text">
                Pas encore de projet...
            </span>

            <NavLink to="/annotations/create" className="add-project-button">

                <FilePlus size={18} />
                Créer un projet

            </NavLink>
        </div>
    )
}