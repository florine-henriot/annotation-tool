import "./ProjectHome.css";

import CompletionCard from "./CompletionBarCard";
import CategoriesGraph from "./CategoriesGraph";
import CalendarTracker from "./Calendar";
import DueDate from "./DueDate";
import MeanAnnotations from "./MeanAnnotations";
import ActionsButtons from "./Actions";


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