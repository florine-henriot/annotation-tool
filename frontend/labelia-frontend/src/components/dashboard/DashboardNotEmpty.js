import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus } from 'lucide-react';
import TopBar from '../topbar/TopBar'
import SideBar from '../sidebar/Sidebar';
import SidebarFooter from '../sidebar_footer/SidebarFooter';
import './DashboardEmpty.css';

function DashboardNotEmpty() {

    const navigate = useNavigate();

    return (
        <div className='dashboard-container'>
            <TopBar pageTitle="Tableau de bord" />
            <SideBar />
            <SidebarFooter />
            <div className='dashboard-page'>
                
            </div>

        </div>
    )
}

export default DashboardNotEmpty;