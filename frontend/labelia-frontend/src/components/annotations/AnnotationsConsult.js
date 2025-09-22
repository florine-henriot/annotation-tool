import React from "react";
import "./AnnotationsConsult.css";
import Loading from "../common/Loading";
import axiosClient from "../api/axiosClient";

export default function AnnotationsConsult({projectId}) {
    const [annotations, setAnnotations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!projectId) return;

        const fetchAnnotations = async () => {
            try {
                const response = await axiosClient.get(`/annotations/${projectId}/annotate`);
                setAnnotations(response.data.annotations || []);
            } catch (error) {
                console.error("Erreur lors de la récupération des annotations :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnotations();
    }, [projectId]);

    if (loading) return <Loading />;

    const nullContent = annotations.filter(a => a.content === null);
    const filledContent =   annotations.filter(a => a.content !== null);
    
    return (
        <div className="annotations-consult">
            <div className="annotations-subtitle">Textes sans annotations</div>
            <div className="table-wrapper">
                <table className="annotations-table">
                    <thead>
                        <th>ID</th>
                        <th>Texte</th>
                    </thead>
                    <tbody>
                        {nullContent.map(a => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.text.substring(0,45)}...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="annotations-subtitle">Textes avec annotations</div>
            <div className="table-wrapper">
                <table className="annotations-table">
                    <thead>
                        <th>ID</th>
                        <th>Texte</th>
                    </thead>
                    <tbody>
                        {filledContent.map(a => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.text.substring(0,45)}...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}