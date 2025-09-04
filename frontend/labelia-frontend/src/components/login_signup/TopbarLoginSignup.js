import "../../App.css"              // Style globaux de l'application
import "./TopbarLoginSignup.css"    // Style spécifiques à ce composant

/**
 * TopbarLoginSignup
 * 
 * Composant react pour la barre supérieure (topbar) pour les pages de login
 * et d'inscription.
 * 
 * Affiche le logo officiel et le nom du logiciel à côté.
 * 
 * Usage:
 *  <TopbarLoginSignup />
 * 
 * Classes CSS utilisées: 
 * 
 * - .topbar : conteneur principal de la topbar
 * - .logo : style du logo
 * - .site-name : nom du logiciel
 * 
 * Props: aucune pour le moment. Peut être étendu pour accepter un 
 * logo ou un nom dynamiques.
 * 
 * @returns {JSX.Element} La barre supérieure pour les pages Login et Signup.
 */

export default function TopbarLoginSignup() {
    return (
        <div className='topbar'>
            <img src='./avatar/logo_labelia.png' alt='Logo' className='logo' />
            <span className='site-name'>Labelia</span>
        </div>
    )
}