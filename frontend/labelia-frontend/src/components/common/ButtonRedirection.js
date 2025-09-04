import React from "react";
import { useNavigate } from "react-router-dom";
import "./ButtonRedirection.css";

/**
 * ButtonRedirect
 * 
 * Composant bouton réutilisable pour rediriger vers vers une autre page.
 * 
 * Props:
 * @param {string} text - Texte affiché dans le bouton. 
 * @param {string} to - Chemin de la route où rediriger l'utilisateur.
 * @param {boolean} disabled - Si true, le bouton est désactivé.
 * 
 * @returns {JSX.Element} - Un bouton stylisé pour rediriger vers la route spécifiée.
 */

export default function ButtonRedirect({text, to, disabled}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!disabled) {
            navigate(to);
        }
    };

    return (
        <button 
        className="redirection-button"
        onClick={handleClick}
        disabled={disabled}>
            {text}
        </button>
    );
}