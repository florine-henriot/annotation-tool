import React from 'react';
import './TopBar.css';

function TopBar({ pageTitle }) {
    return (
        <div className='topbar-container'>
            {/* Partie gauche : logo + titre */}
            <div className='topbar-left'>
                <img src='avatar/logo.png' alt='Logo' className='topbar-logo' />
                <span className='topbar-site-name'>Labelia</span>
            </div>

            {/* Partie droite : barre colorée + titre de la page */}
            <div className='topbar-right'>
                <div className='topbar-color-bar'></div>
                <span className='topbar-page-title'>{pageTitle}</span>
            </div>
        </div>
    )
}

export default TopBar;