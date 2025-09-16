import Layout from "../components/common/Layout";
import {File} from 'lucide-react';
import { useParams } from "react-router-dom";
import React from "react";
import axiosClient from "../components/api/axiosClient";
import LoadingPage from "./LoadingPage";

export default function AnnotationsPage() {

    const { projectId } = useParams();

    // Etat local pour stocker le projet, le status de chargement et une éventuelle erreur
    const [project, setProject] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        /**
         * Récupère les données du projet via l'API.
         * Gère les états de chargement et d'erreur.
         */
        const fetchProject = async () => {
            try {
                const response = await axiosClient.get(`/annotations/${projectId}/annotate`);
                setProject(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || "Erreur lors du chargement du projet");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    // Ecran de chargement pendant la requête
    if (loading) return <LoadingPage />
    // Affichage de l'erreur si la requête échoue
    if (error) return <p style={{color: "red"}}>{error}</p>

    return (
        <div className="page">

            <Layout icon={File} pageTitle={`Annotations ${project.project_name}`} />

        </div>
    )
}