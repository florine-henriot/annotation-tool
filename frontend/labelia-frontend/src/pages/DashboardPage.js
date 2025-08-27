import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import DashboardEmpty from '../components/dashboard/DashboardEmpty';

function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [hasProjects, setHasProjects] = useState(false);

    useEffect(
        () => {
            axiosClient.get('/dashboard', { withCredentials: true})
            .then(res => {
                setHasProjects(res.data.has_projects);
            })
            .catch(err => {
                console.error("Erreur dashboard :", err.response?.data || err.message);
            })
            .finally(() => setLoading(false));
        }, []);
    
    if (loading) return <p>Chargement...</p>;

    if (!hasProjects) return <DashboardEmpty />
}

export default DashboardPage;