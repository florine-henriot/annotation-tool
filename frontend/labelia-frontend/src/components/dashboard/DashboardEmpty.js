import { FilePlus } from 'lucide-react';
import { NavLink } from "react-router-dom";
import "../../App.css";
import "./Dashboard.css";

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