import React from "react";
import LoadingPage from "./LoadingPage";
import Layout from "../components/common/Layout";
import ProjectCreation from "../components/project_creation/ProjectCreation";
import {FilePlus} from 'lucide-react';

export default function ProjectCreationPage() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) return <LoadingPage />

    return (
        <div className="page">

            <Layout icon={FilePlus} pageTitle="Créer un projet" />

            <div className="container">

                <ProjectCreation />

            </div>

        </div>
    )
}