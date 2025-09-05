import { CircleX } from 'lucide-react';
import './Popup.css';

/**
 * Popup
 * 
 * Ce composant affiche une fenêtre modale centrée avec un fond semi-transparent.
 * Le contenu affiché est passé via la prop children.
 * Une icône de fermeture est affichée en haut à droite et déclenche la fonction onClose
 * quand elle est appliquée.
 * 
 * Props:
 * @param {React.ReactNode} children - Contenu de la popup (texte, bouton, formulaire, etc)
 * @param {Function} onClose - Fonction appelée lorsque l'utilisateur ferme la popup.
 * 
 * Usage:
 * {showPopup && (
 *      <Popup onClose={() => setShowPopup(false)}>
 *          <h2>Succès !</h2>
 *          <button onClick={() => navigate('/login')}>
 *              Page de connexion 
 *          </button>
 *      </Popup>
 * )}
 * 
 * @returns {JSX.Element} - Une popup où on peut mettre ses div dedans.
 */

export default function Popup({ children, onClose }) {

    return (

        <div className='popup-overlay'>
            <div className='popup-content'>
                <CircleX className='close-icon' onClick={onClose} />
                {children}
            </div>
        </div>

    )
}