import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axiosClient from "../api/axiosClient";
import { LogOut, User } from 'lucide-react'
import Popup from './Popup';
import "../../App.css";
import "./Topbar.css";

export default function TopBar( { icon: Icon, pageTitle }) {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);

    const handleClosePopup = () => {
        setShowPopup(false);
        navigate('/login')
    }

    const handleLogout = async () => {
        try {
            await axiosClient.post("/auth/logout", {}, {withCredentials: true});
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate("/login")
            }, 2000);
        } catch (err) {
            console.error("Erreur lors de la déconnexion :", err);
        }
    };

    return (
        <div className="topbar-common">
            <img src='./avatar/logo_labelia.png' alt='Logo' className='logo' />
            <span className='site-name'>Labelia</span>

            <span className="breadcrumbs">
                <div className="page-title">
                    {Icon && <Icon size={18} style={{ marginRight: "10px" }} />}
                    {pageTitle}
                </div>
            </span>

            <div className="right-element">

                <span>
                    <NavLink to="/account" className="account-button">
                        <User size={18} style={{marginRight: "5px"}} />
                        Mon compte
                    </NavLink>
                </span>

                <span>
                    <button type="submit" 
                        className="deconnect-button" 
                        onMouseEnter={() => setShowTooltip(true)} 
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={handleLogout}>
                        <LogOut size={18} />
                    </button>
                    {showTooltip && <span className='tooltip'>Déconnexion</span>}
                </span>
            </div>

            {showPopup && (
                <Popup onClose={handleClosePopup}>
                    Vous allez être déconnecté.
                </Popup>
            )}
        </div>
    )
}