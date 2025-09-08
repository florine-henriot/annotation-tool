import React from "react";
import axiosClient from "../components/api/axiosClient";
import DashboardEmpty from "../components/dashboard/DashboardEmpty";
import Layout from "../components/common/Layout";
import { PieChart } from 'lucide-react';

export default function DashboardPage() {
    const [loading, setLoading] = React.useState(true);
    const [hasProjects, setHasProjects] = React.useState(false);

    React.useEffect(
        () => {
            axiosClient.get("/dashboard", {withCredentials: true})
            .then(res => {
                setHasProjects(res.data.has_projects);
            })
            .catch(err => {
                console.error("Erreur dashboard :", err.response?.data || err.message);
            })
            .finally(() => setLoading(false));
        }, []
    );

    if (loading) return <p>Chargement...</p>;

    if (!hasProjects) return (
        <div className="page">

            <Layout icon={PieChart} pageTitle={"Dashboard"} />

            <DashboardEmpty />

        </div>
    )

    if (hasProjects) return (
        <div className="page">

            <Layout icon={PieChart} pageTitle={"Dashboard"} />

        </div>
    )
}