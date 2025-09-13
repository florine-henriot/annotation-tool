import "./ProjectHome.css";

export default function ProjectHome() {
    return (
        <div className="container-project-home">
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

            <div className="cell">
                <h2 className="project-home-subtitle">
                    Date d'échéance
                </h2>
            </div>

            <div className="cell">
                <h2 className="project-home-subtitle">
                    Nombre moyen d'annotations par jour
                </h2>
            </div>

            <div className="cell">5</div>
            <div className="cell">6</div>
            <div className="cell">7</div>
            <div className="cell">8</div>
            <div className="cell">9</div>
        </div>
    )
}