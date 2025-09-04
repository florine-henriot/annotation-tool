import "./InputField.css"

/**
 * InputField
 * 
 * Composant React réutilisable représentant un champ de formulaire ('input')
 * avec style cohérent pour toutes les pages de l'application.
 * 
 * Ce composant applique la classe CSS "input-field" pour gérer : 
 * - la largeur et la hauteur de l'input,
 * - le padding interne
 * - le border radius
 * - la bordure et le style au focus
 * - l'outline et la transmission
 * 
 * Props :
 * @param {string} type - Type de l'input (ex: "text", "email"...)
 * @param {string|number} value - Valeur actuelle de l'input
 * @param {function} onChange - Fonction appelée lorsque la valeur change e => ...
 * @param {string} placeholder - Texte affiché lorsqu'aucune valueur n'est saisie
 * @param {boolean} type - Si true, l'input sera requis pour la soumission du formulaire
 * 
 * Usage :
 * <InputField
    * type="email"
    * value={email}
    * onChange={e => setEmail(e.target.value)}
    * placeholder="Entrez votre email"
    * required={true}
 * />
 * @returns {JSX.Element} - Champ du formulaire stylisé
 */

export default function InputField(
    {
        type,
        value,
        onChange,
        placeholder,
        required
    }
) {
    return (
            <input 
            className="input-field"
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            />
    );
}