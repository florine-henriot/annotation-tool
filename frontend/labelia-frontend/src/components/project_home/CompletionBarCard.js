import "./CompletionBarCard.css";

export default function CompletionCard( { project }) {
    return (
        <div className="progress-container">
            <div className="progress-bar-project">
                <div className="progress-fill-project" style={{ width: `${project.completion || 0}%` }} />
            </div>
            <span className="progress-text">
                {project.completion || 0} %
            </span>
        </div>
    )
}