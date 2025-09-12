import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axiosClient from "../api/axiosClient";
import { LogOut, User } from 'lucide-react'
import Popup from './Popup';
import "../../App.css";
import "./Topbar.css";

/**
 * Topbar
 * 
 * Barre supérieure de l'application, affichant : 
 * - le logo et le nom du site
 * - le titre de la page avec icône facultative,
 * - un lien vers la page de compte,
 * - un bouton de déconnexion avec tooltip et popup de confirmation.
 * 
 * Gère la déconnexion en appelant l'API "/auth/login" et redirige vers la page de login.
 * 
 * @param {Object} props
 * @param {React.Component} props.icon - Icône facultative à afficher à côté du titre de la page
 * @param {String} props.pageTitle - Titre de la page affiché dans la topbar
 * 
 * @returns {JSX.Element} La barre supérieure de navigation
 */

export default function TopBar( { icon: Icon, pageTitle }) {
    const navigate = useNavigate();

    // Etats internes
    const [showTooltip, setShowTooltip] = React.useState(false); // Affichage du tooltip sur le bouton de déconnexion
    const [showPopup, setShowPopup] = React.useState(false); // Affichage du popup de confirmation
    const [menuOpen, setMenuOpen] = React.useState(false); // Si le menu mobile est ouvert (non utilisé ici)

    /**
     * Ferme le popup de déconnexion et redirige vers la page de Login
     */
    const handleClosePopup = () => {
        setShowPopup(false);
        navigate('/login')
    }

    /**
     * Déconnexion de l'utilisateur :
     * - Appelle l'API '/auth/logout"
     * - Affiche un popup de confirmation
     * - Redirige vers la page login après 2 secondes
     */
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
            <img src='/avatar/logo_labelia.png' alt='Logo' className='logo' />
            <span className='site-name'>Labelia</span>

            {/* Breadcrumbs cachés en mobile */}
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