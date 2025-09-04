import React from 'react';
import "../../App.css"
import "./TopbarLoginSignup.css"

export default function TopbarLoginSingup() {
    return (
        <div className='topbar'>
            <img src='./avatar/logo_labelia.png' alt='Logo' className='logo' />
            <span className='site-name'>Labelia</span>
        </div>
    )
}