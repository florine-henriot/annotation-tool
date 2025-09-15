import './MeanAnnotations.css';

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