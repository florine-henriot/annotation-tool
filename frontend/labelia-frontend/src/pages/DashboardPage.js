import React from "react";
import axiosClient from "../components/api/axiosClient";
import DashboardEmpty from "../components/dashboard/DashboardEmpty";
import DashboardNotEmpty from "../components/dashboard/DashboardNotEmpty";
import Layout from "../components/common/Layout";
import LoadingPage from "./LoadingPage";
import { PieChart } from 'lucide-react';

/**
 * DashboardPage
 * 
 * Page principale du tableau de bord.
 * 
 * Fonctionnalités : 
 * - Récupère via API si l'utilisateur possède des projets d'annotation.
 * - Affiche un écran de changement pendant la récupération.
 * - Affiche : 
 *  - DashboardEmpty si aucun projet n'existe
 *  - DashboardNotEmpty si des projets existent
 * - Intègre un layout commun (barre de navigation, icône et titre).
 * 
 * @returns 
 */

export default function DashboardPage() {
    // Etat de chargement (true au dépars, puis false quand la requête est terminée)
    const [loading, setLoading] = React.useState(true);

    // Booléen indiquant si des projets existent
    const [hasProjects, setHasProjects] = React.useState(false);

    /**
     * useEffet : récupération des projets au montage du composant
     * - GET sur /dashboard
     * - Stocke has_projects dans le state
     */
    React.useEffect(
        () => {
            axiosClient.get("/dashboard", {withCredentials: true})
            .then(res => {
                setHasProjects(res.data.has_projects);
            })
            .catch(err => {
                console.error("Erreur dashboard :", err.response?.data || err.message);
            })
            .finally(() => setLoading(false)); // Fin du chargement
        }, []
    );

    // Pendant la requête -> page de chargement
    if (loading) return <LoadingPage />;

    // Cas où il n'y a pas encore de projet
    if (!hasProjects) return (
        <div className="page">

            <Layout icon={PieChart} pageTitle={"Dashboard"} />

            <div className="container">

                <DashboardEmpty />

            </div>

        </div>
    )

    // Cas où des projets existent déjà
    if (hasProjects) return (
        <div className="page">

            <Layout icon={PieChart} pageTitle={"Dashboard"} />

            <div className="container">

                <DashboardNotEmpty />

            </div>

        </div>
    )
}