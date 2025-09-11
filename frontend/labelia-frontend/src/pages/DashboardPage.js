import React from "react";
import axiosClient from "../components/api/axiosClient";
import DashboardEmpty from "../components/dashboard/DashboardEmpty";
import DashboardNotEmpty from "../components/dashboard/DashboardNotEmpty";
import Layout from "../components/common/Layout";
import LoadingPage from "./LoadingPage";
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

    if (loading) return <LoadingPage />;

    if (!hasProjects) return (
        <div className="page">

            <Layout icon={PieChart} pageTitle={"Dashboard"} />

            <div className="container">

                <DashboardEmpty />

            </div>

        </div>
    )

    if (hasProjects) return (
        <div className="page">

            <Layout icon={PieChart} pageTitle={"Dashboard"} />

            <div className="container">

                <DashboardNotEmpty />

            </div>

        </div>
    )
}