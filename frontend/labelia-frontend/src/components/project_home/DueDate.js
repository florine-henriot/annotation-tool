import "./DueDate.css";

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