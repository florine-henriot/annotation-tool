import "./ProjectHome.css";

import CompletionCard from "./CompletionBarCard";
import CategoriesGraph from "./CategoriesGraph";
import CalendarTracker from "./Calendar";
import DueDate from "./DueDate";
import MeanAnnotations from "./MeanAnnotations";
import ActionsButtons from "./Actions";

/**
 * ProjectHome
 * 
 * Composant React affichant la page d'accueil d'un projet.
 * 
 * Il regroupe plusieurs sous-composants qui représentent : 
 * - le nom du projet et sa progression globale
 * - la répartition des catégories
 * - Un calendrier de sui des annotations
 * - La date d'échéance du projet
 * - Le nombre moyen d'annotations par jour
 * - Les actions possibles sur le projet
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.project - Object représentant le projet
 * @param {string} props.project.project_name - Nom du projet
 * @param {Array<Object>} props.project.annotations - Tableau des annotations du projet
 * @param {Array<string>} props.project.categories - Tableau des catégories du projet
 * @param {string} props.project.due_date - Date d'échéance du projet au format ISO.
 * @param {number} props.project.completion - Pourcentage de complétion du projet
 * @param {string} [props.project.guidelines_file_path] - Chemin du fichier de guidelines
 * @param {string} [props.project.notes] - Notes associées au projet.
 * 
 * @example
 * <ProjectHome projet={project} />
 * 
 * @returns {JSX.Element} Un composant affichant la vue complète d'un projet.
 */
export default function ProjectHome( {project }) {
    return (
        <div className="container-project-home">

            <div className="cell-title wide">
                <h2 className="project-title">
                    {project.project_name}
                </h2>
                <CompletionCard project={project} />
            </div>

            <div className="cell">
                <h2 className="project-home-subtitle">
                    Répartition des catégories
                </h2>
                <div className="cell-content">
                    <CategoriesGraph project={project} />
                </div>
            </div>
            
            <div className="cell">
                <h2 className="project-home-subtitle">
                    Tracker des annotations
                </h2>
                <div className="cell-content">
                    <CalendarTracker project={project} />
                </div>
            </div>

            <div className="subgrid">
                <div className="cell">
                    <h2 className="project-home-subtitle">
                        Date d'échéance
                    </h2>
                    <div className="cell-content">
                        <DueDate project={project} />
                    </div>
                </div>
                <div className="cell">
                    <h2 className="project-home-subtitle">
                        Nombre moyen d'annotations par jour
                    </h2>
                    <div className="cell-content">
                        <MeanAnnotations project={project} />
                    </div>
                </div>
            </div>

            <div className="cell wide">
                <div className="cell-content">
                    <ActionsButtons project={project} />
                </div>
            </div>

        </div>
    )
}