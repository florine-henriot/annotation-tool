import React from 'react';
import axiosClient from '../components/api/axiosClient';
import TopbarLoginSignup from '../components/login_signup/TopbarLoginSignup';
import Protection from '../components/protected_page/Protection';

/**
 * RequireAuth
 * 
 * Vérifie si l'utilisateur est authentifié avant de rendre le contenu enfant. 
 * Si l'utilisateur n'est pas authentifié, affiche la page de protection avec la topbar
 * et le composant Protection.
 * 
 * Usage:
 * <RequireAuth>
 *      <Dashboard />
 * </RequireAuth>
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu à afficher si l'utilisateur est authentifié.
 *  
 * @returns {JSX.Element} Le contenu protégé si authentifié, si non la page de protection.
 */

export default function RequireAuth ( { children }) {
    const [authenticated, setAuthenticated] = React.useState(false);

    // Vérification de l'authentification au montage du composant
    React.useEffect(() => {
        axiosClient.get('/auth/protected', 
            {withCredentials: true}
        )
        .then(res => {
            console.log("Donnée protégées :", res.data);
            setAuthenticated(true);
        })
        .catch(err => {
            console.error("Erreur accès protégé : ", err.response?.data || err.message);
            setAuthenticated(false);
        });
    }, []);

    // Si non authentifié, afficher la page de protection
    if (!authenticated) {
        return (    
            <div className='page'>

                <TopbarLoginSignup />

                <div className='container'>

                    <Protection />

                </div>

            </div>
        )
    }

    // Si authentifié, afficher les enfant
    return (
        <>{ children }</>
    )
}