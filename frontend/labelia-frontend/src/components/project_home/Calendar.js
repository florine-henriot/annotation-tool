import 'react-calendar/dist/Calendar.css';
import "./Calendar.css";
import Calendar from 'react-calendar';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function CalendarTracker({ project }) {

    const annotationsByDay = project.annotations.reduce((acc, a) => {
        if (a.date) {
            const day = new Date(a.date).toLocaleDateString('en-CA');
            acc[day] = (acc[day] || []).concat(a);
        }
        return acc;
    }, {});

    const dueDateStr = project.due_date 
        ? new Date(project.due_date).toLocaleDateString('en-CA')
        : null;

    const todayKey = new Date().toLocaleDateString('en-CA');

    // Générer un set de toutes les dates à tooltip
    const tooltipDates = new Set([
        ...Object.keys(annotationsByDay),
        dueDateStr,
        todayKey
    ].filter(Boolean)); // filter(Boolean) pour éviter les null

    return (
        <div className="calendar-card">
            <Calendar
                tileClassName={({ date, view }) => {
                    if (view !== 'month') return null;

                    const dateKey = date.toLocaleDateString('en-CA');
                    const classes = [];

                    if (dueDateStr && dateKey === dueDateStr) classes.push('due-date');
                    if (annotationsByDay[dateKey]) classes.push('annotation-day');
                    if (todayKey === dateKey) classes.push('today');

                    return classes.join(' ');
                }}
                tileContent={({ date, view }) => {
                    if (view !== 'month') return null;

                    const dateKey = date.toLocaleDateString('en-CA');

                    if (tooltipDates.has(dateKey)) {
                        return (
                        <div
                            data-tooltip-id={`tooltip-${dateKey}`}
                            className="tooltip-overlay"
                        ></div>
                        );
                    }
                    return null;
                }}
                prev2Label={null}
                next2Label={null}
            />

            {/* Tous les tooltips générés dynamiquement */}
            {Array.from(tooltipDates).map(dateKey => (
                <Tooltip key={dateKey} id={`tooltip-${dateKey}`} place="top">
                    {dateKey === todayKey
                        ? "Aujourd'hui"
                        : dateKey === dueDateStr
                        ? "Date d'échéance"
                        : `${annotationsByDay[dateKey].length} annotation(s)`
                    }
                </Tooltip>
            ))}
        </div>
    );
}