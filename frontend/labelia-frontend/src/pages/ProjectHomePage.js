import ProjectHome from "../components/project_home/ProjectHome";
import Layout from "../components/common/Layout";
import { File } from "lucide-react";
import { useParams } from "react-router-dom";
import React from "react";
import axiosClient from "../components/api/axiosClient";
import LoadingPage from "./LoadingPage";

export default function ProjectHomePage() {
    const { projectId } = useParams();

    const [project, setProject] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosClient.get(`/annotations/${projectId}`);
                setProject(response.data);
            } catch (err) {
                setError(err.reponse?.data?.detail || "Erreur lors du chargement du projet");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    if (loading) return <LoadingPage />
    if (error) return <p style={{color: "red"}}>{error}</p>

    return (
        <div className="page">

            <Layout icon={File} pageTitle={`Projet ${project.project_name}`} />

            <div className="container">

                <ProjectHome />

            </div>

        </div>
    )
}