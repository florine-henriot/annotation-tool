import './ButtonSubmit.css';

/**
 * ButtonSubmit
 * 
 * Composant bouton réutilisable pour les formulaire ou actions.
 * Permet de déclencher une fonction au click et de gérer l'état désactivé.
 * 
 * Props:
 * @param {string} text - Le texte affiché dans le bouton
 * @param {function} onClick - La fonction à exécuter lors du clic.
 * @param {boolean} disabled - Indique si le bouton est désactivé.
 * 
 * Exemple d'utilisation
 * <ButtonSubmit
 *  text="Se connecter"
 *  onClick={handleLogin}
 *  disabled={false}
 * />
 * @returns {JSX.Element} - Un élément <button> stylisé avec les props fournies.
 */

export default function ButtonSubmit({text, onClick, disabled}) {
    return(
        <button className='button-submit' onClick={onClick} disabled={disabled}>{text}</button>
    );
}