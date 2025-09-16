import './MeanAnnotations.css';

/**
 * MeanAnnotations
 * 
 * Composant React affichant le nombre moyen d'annotations par jour pour un projet donné.
 * 
 * Le calcul est effectué en divisant le nombre total d'annotations effectuées par le nombre
 * de jours écoulés depuis la première annotation du projet. Si aucune date n'est présente
 * le calcul utilise la date actuelle comme référence.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.project - Object représentant le projet.
 * @param {Array<Object>} props.project.annotations - Tableau des annotations du projet
 * @param {string} [props.project.annotations[].content] - Contenu de l'annotations
 * @param {string} [props.project.annotations[].date] - Date de l'annotation au format ISO
 * 
 * @example
 * <MeanAnnotations project={project} />
 * 
 * @returns {JSX.Element} Un composant affichant le nombre moyen d'annotations par jour.
 */
export default function MeanAnnotations({ project }) {
    return (
        <p className='mean-annotations'>
            {(() => {
                const totalAnnotations = project.annotations.filter(a => a.content).length;
                const annotatedDates = project.annotations
                    .filter(a => a.date)
                    .map(a => new Date(a.date));
                const firstDate = annotatedDates.length ? new Date(Math.min(...annotatedDates)) : new Date();
                const daysElapsed = Math.max((new Date() - firstDate) / (1000 * 60 * 60 * 24), 1);
                return Math.round(totalAnnotations / daysElapsed);
            })()}
        </p>
    )
}