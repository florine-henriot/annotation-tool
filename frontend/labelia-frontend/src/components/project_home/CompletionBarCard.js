import "./CompletionBarCard.css";

/**
 * CompletionCard
 * 
 * Composant React affichant une barre de progression représentant le pourcentage de
 * complétion d'un projet.
 * 
 * La barre de progression et le texte indiquent la valeur de project.completion.
 * Si aucune valeur n'est fournie, la complétion est considérée comme 0%.
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.project - Object représentant le projet.
 * @param {number} [props.project.completion] - Pourcentage de complétion du projet (0 - 100).
 * 
 * @example
 * <CompletionCard project={project} />
 *  
 * @returns {JSX.Element} Un composant affichant la barre de complétion et le pourcentage. 
 */
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