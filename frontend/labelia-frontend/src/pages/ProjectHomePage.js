import ProjectHome from "../components/project_home/ProjectHome";
import Layout from "../components/common/Layout";
import { File } from "lucide-react";
import { useParams } from "react-router-dom";
import React from "react";
import axiosClient from "../components/api/axiosClient";
import LoadingPage from "./LoadingPage";

/**
 * ProjectHomePage
 * 
 * Cette page : 
 * - Récupère l'identifiant du projet depuis l'URL via useParams
 * - Fait un appel API pour charger les données du projet (noms, annotations, catégories, etc...)
 * - Affiche un écran de chargement ou un message d'erreur si nécessaire.
 * - Rend le composant {@link ProjectHome} avec les données du projet une fois celles-ci disponibles 
 * 
 * @component
 * @example
 * // Dans une route React Router
 * <Route path="project/:projectID element={<ProjectHomePage />} />"
 * 
 * @returns {JSX.Element} La page affichant les détails du projet, ou un état de chargement/erreur.
 */
export default function ProjectHomePage() {
    const { projectId } = useParams(); // ID du projet depuis l'URL

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
                const response = await axiosClient.get(`/annotations/${projectId}`);
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

    // Contenu principal si tout est ok
    return (
        <div className="page">

            <Layout icon={File} pageTitle={`Projet ${project.project_name}`} />

            <div className="container">

                <ProjectHome project={project}/>

            </div>

        </div>
    )
}