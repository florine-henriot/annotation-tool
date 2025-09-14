import 'react-calendar/dist/Calendar.css';
import "./Calendar.css";
import Calendar from 'react-calendar';

export default function CalendarTracker( { project }) {
    // Construction de annotationsByDay pour le calendrier
    const annotationsByDay = project.annotations.reduce((acc, a) => {
        if (a.date) {
            const day = new Date(a.date).toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + a;
        }
        return acc;
    }, {});

    return (
        <div className="calendar-card">
            <Calendar
                tileClassName={({ date, view }) => {
                const dayAnnotations = annotationsByDay[date.toISOString().split('T')[0]];
                return dayAnnotations ? "highlighted-day" : null;
                }}
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={false}
            />
        </div>
    )
}