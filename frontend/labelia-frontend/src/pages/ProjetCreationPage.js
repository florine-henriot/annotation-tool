import React from "react";
import LoadingPage from "./LoadingPage";
import Layout from "../components/common/Layout";
import ProjectCreation from "../components/project_creation/ProjectCreation";
import {FilePlus} from 'lucide-react';

/**
 * ProjectCreationPage
 * 
 * Page principale pour créer un nouveau projet d'annotation.
 * 
 * Fonctionnalités : 
 * - Affiche un écran de chargement initial (1.5s) via LoadingPage.
 * - Affiche le layout commun avec icône et titre de page.
 * - Contient le composant ProjectCreation pour remplir le formulaire.
 * 
 * Notes : 
 * - Le state "loading" sert uniquement à simuler un temps de chargement.
 * - Layout et container assurent la mise en page cohérente avec le reste de l'application.
 * @returns 
 */
export default function ProjectCreationPage() {
    // Etat de chargement initial
    const [loading, setLoading] = React.useState(true);

    // useEffect pour simuler le chargement pendant 1.5 secondes
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer); // Nettoyage du timer au démontage
    }, []);

    // Affichage du loader si loading = true
    if (loading) return <LoadingPage />

    // Affichage de la page de création de projet
    return (
        <div className="page">

            <Layout icon={FilePlus} pageTitle="Créer un projet" />

            <div className="container">

                <ProjectCreation />

            </div>

        </div>
    )
}