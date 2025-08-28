import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../topbar/TopBar'
import SideBar from '../sidebar/Sidebar';
import './DashboardEmpty.css';

function DashboardEmpty() {

    const navigate = useNavigate();

    return (
        <div className='dashboard-container'>
            <TopBar pageTitle="Tableau de bord" />
            <SideBar />
            <div className='dashboard-page'>
                Contenu
            </div>

        </div>
    )
}

export default DashboardEmpty;