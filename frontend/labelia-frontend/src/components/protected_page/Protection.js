import ButtonRedirect from "../common/ButtonRedirection";
import "../../App.css";
import "./Protection.css";

/**
 * Protection
 * 
 * Affiche une carte indiquant que l'utilisateur n'est pas connecté.
 * Comprend un avatar, un message et un bouton pour rediriger vers la 
 * page de login.
 * 
 * Usage :
 * <Protection />
 * 
 * @returns {JSX.Element} La carte de protection pour les utilisateurs
 *      non connectés.
 */

export default function Protection() {
    return (
        <div className="card">
            {/* Avatar affiché */}
            <img src="./avatar/logged_out.png" alt="Avatar" className='avatar' />
            
            {/* Message informatif */}
            <h2 className="title-logged-out">Vous n'êtes pas connecté.</h2>
            
            {/* Bouton de redirection vers la page de connexion */}
            <ButtonRedirect
                text="PAGE DE CONNEXION"
                to="/login"
                disabled={false}
            />
        </div>
    )
}