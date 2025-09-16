import "./DueDate.css";

/**
 * DueDate
 * 
 * Composant React affichant la date d'échéance d'un projet et un message indiquant si 
 * la date est passée, présente ou future.
 * 
 * Le composant calcule le nombre de jours restants ou dépassés par rapport à la date actuelle et
 * applique une classe CSS correspondante pour le style due-future, due-today et due-past.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.project - Object représentant le projet.
 * @param {string} props.project.due_date - Date d'échéance du projet au format ISO.
 * 
 * @example
 * <DueDate projet={project} />
 *  
 * @returns {JSX.Element} Un composant affichant la date d'échéance et un message de statut. 
 */
export default function DueDate({ project }) {

    const dueDate = new Date(project.due_date);
    const today = new Date();

    // On remet les heures à 0 pour comparer uniquement les dates
    dueDate.setHours(0,0,0,0)
    today.setHours(0,0,0,0)

    const diffTime = dueDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let message;
    let statusClass = "";

    if (diffDays > 0) {
        message = `Il vous reste ${diffDays} jour${diffDays > 1 ? 's': ""}.`;
        statusClass = "due-future"
    } else if (diffDays === 0) {
        message = "Dernier jour.";
        statusClass = "due-today";
    } else {
        message = `Date d'échéance dépassée de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's': ''}.`;
        statusClass = "due-past";
    }

    return (
        <div className={`due-date-container ${statusClass}`}>
            <div className="due-date-text">
                Date d'échéance le {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(project.due_date))}.
            </div>
            <div className="due-date-message">
                {message}
            </div>
        </div>
    )
}