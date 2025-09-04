import React from 'react';
import "./PasswordInput.css"

/**
 * PasswordInput
 * 
 * Champ de saisie pour mot de passe avec une option permettant d'afficher ou masquer
 * le texte saisi.
 * 
 * ## Fonctionalités:
 * - Affiche un champ input contrôlé pour saisir le mot de passe.
 * - Inclut un bouton icône pour afficher ou masquer le mot de passe
 * - Le mot de passe est géré par le parent via les props password et setPassword
 * - L'état interne showPassword est utilisé pour basculer l'affichage.
 * 
 * Usage:
 * const [password, setPassword] = React.useState('');
 * <PaswwordInput
 *      password={password}
 *      setPassword={setPassword}
 *      placehold="Mot de passe"
 * />
 * @param {string} password - La valeur actuelle du mot de passe
 * @param {function} setPassword - Fonction pour mettre à jour la valeur du mot de passe
 * @param {string} placeholder - La valeur affichée avant la saisie.
 * @returns 
 */

export default function PasswordInput({password, setPassword, placeholder}) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className='password-container'>
            <input
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className='password-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Afficher ou masquer le mot de passe"
            >
                {showPassword ? (
                    <svg xmlnw="http://www.w3.org/2000/svg" height="20" width="20" fill="#3B82F6" viewBox="0 0 24 24">
                        <path d="M12 6.5c-4.14 0-7.68 2.56-9.2 6.5 1.52 3.94 5.06 6.5 9.2 6.5s7.68-2.56 9.2-6.5c-1.52-3.94-5.06-6.5-9.2-6.5zm0 11c-2.49 0-4.5-2.01-4.5-4.5S9.51 8.5 12 8.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/>
                        <circle cx="12" cy="12" r="2" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#3B82F6" viewBox="0 0 24 24">
                        <path d="M12 6.5c-4.14 0-7.68 2.56-9.2 6.5.76 1.96 2.12 3.62 3.88 4.76L4 21l1.41 1.41L20.5 5.91 19.09 4.5l-3.15 3.15C14.7 7.2 13.38 6.5 12 6.5zm-6.83 6.5c1.08-2.27 3.44-4 6.83-4 1.04 0 2.03.25 2.9.7L5.17 13zm12.7-4.83L9.17 16c.93.36 1.94.55 2.83.55 3.39 0 5.75-1.73 6.83-4-.45-1.12-1.18-2.1-2.13-2.88z" />
                    </svg>
                )}
            </button>
        </div>
    )
}