import "./CategoriesGraph.css";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function CategoriesGraph ( { project }) {
    // Répartition des catégories
    const categoryData = project.categories.map((cat) => {
        const count = project.annotations.filter(a => a.content === cat).length;
        return { name: cat, value: count, color: getCategoryColor(cat)};
    });

    // Ajouter une catégorie pour élément non annoté
    const nonAnnotatedCount = project.annotations.filter(a => !a.content).length;
    if (nonAnnotatedCount > 0) {
        categoryData.push({ name: "Non annoté", value: nonAnnotatedCount, color: "#E5E7EB"});
    };

    // Fonction ppour récupérer la couleur d'une catégorie
    function getCategoryColor(cat) {
        const colors = ["#48e8a5", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];
        const index = project.categories.indexOf(cat) % colors.length;
        return colors[index];
    };

    return (
        <div className="projects-stats-container">
            <div className="chart-and-legend">
                {/* Graph */}
                <PieChart width={200} height={200}>
                <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>

                {/* Légende */}
                <div className="legend">
                {categoryData.map((entry, index) => (
                    <div key={index} className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="legend-label">{entry.name}</span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}