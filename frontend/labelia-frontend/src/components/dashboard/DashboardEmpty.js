import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus } from 'lucide-react';
import TopBar from '../topbar/TopBar'
import SideBar from '../sidebar/Sidebar';
import SidebarFooter from '../sidebar_footer/SidebarFooter';
import './DashboardEmpty.css';

function DashboardEmpty() {

    const navigate = useNavigate();

    return (
        <div className='dashboard-container'>
            <TopBar pageTitle="Tableau de bord" />
            <SideBar />
            <SidebarFooter />
            <div className='dashboard-page'>
                <div className='dashboard-empty-card'>
                    <h2 className='project-title'>
                        PAS ENCORE DE PROJET
                    </h2>
                    <button className='add-project-btn' onClick={() => navigate("/create-project")}>
                        <FilePlus size={18} style={{marginRight: "8px"}}/>
                        CRÉER UN PROJET
                    </button>
                </div>
            </div>

        </div>
    )
}

export default DashboardEmpty;