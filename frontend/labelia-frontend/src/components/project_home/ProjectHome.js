import "./ProjectHome.css";

import CompletionCard from "./CompletionBarCard";


export default function ProjectHome( {project }) {
    return (
        <div className="container-project-home">

            <div className="cell wide">
                <h2 className="project-title">
                    {project.project_name}
                </h2>
                <CompletionCard project={project} />
            </div>

            <div className="cell">
                <h2 className="project-home-subtitle">
                    Répartition des catégories
                </h2>
            </div>
            
            <div className="cell">
                <h2 className="project-home-subtitle">
                    Tracker des annotations
                </h2>
            </div>

            <div className="subgrid">
                <div className="cell">
                    <h2 className="project-home-subtitle">
                        Date d'échéance
                    </h2>
                </div>
                <div className="cell">
                    <h2 className="project-home-subtitle">
                        Nombre moyen par jour
                    </h2>
                </div>
            </div>

            <div className="cell wide">
                <h2 className="project-home-subtitle">
                    Boutons d'action
                </h2>
            </div>

        </div>
    )
}