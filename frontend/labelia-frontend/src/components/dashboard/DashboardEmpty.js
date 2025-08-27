import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../topbar/TopBar'
import './DashboardEmpty.css';

function DashboardEmpty() {

    const navigate = useNavigate();

    return (
        <div className='dashboard-container'>
            <TopBar pageTitle="Tableau de bord" />

            <div className='dashboard-page'>
                Contenu
            </div>

        </div>
    )
}

export default DashboardEmpty;