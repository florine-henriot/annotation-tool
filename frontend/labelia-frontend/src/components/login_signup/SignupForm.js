import React from 'react';
import axiosClient from '../api/axiosClient';
import InputField from '../common/InputField';
import ButtonSubmit from '../common/ButtonSubmit';
import ButtonRedirect from '../common/ButtonRedirection';
import PasswordInput from './PasswordInput';
import Popup from '../common/Popup';
import "../../App.css"
import "./Form.css"

/**
 * SignupForm
 * 
 * Composant de formulaire de l'inscription.
 * Permet à l'utilisateur de créer un compte en saisissant : 
 * - Prénom
 * - nom de famille
 * - entreprise (facultatif)
 * - email
 * - mot de passe
 * 
 * La validation du mot de passe est effectuée côté frontend:
 * - minimum 8 caractères
 * - au moins 1 minuscule
 * - au moins une majuscule
 * - au moins un caractère spécial
 * 
 * Le formulaire envoie les données au backend via axiosClient.
 * En cas de succès, une popup de confirmation s'affiche.
 * 
 * @returns {JSX.Element} Formulaire d'inscription avec gestion des erreurs et
 *      popup de succès.
 */

export default function SignupForm() {

    // Etats du formulaire
    const [name, setName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [company, setCompany] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState("");
    const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);

    /**
     * validatePassword
     * 
     * Vérifie que le mot de passe respecte les critères de sécurité.
     * 
     * @param {string} password - Mot de passe à valider
     * @returns {boolean} true si valide, false sinon
     */

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        return regex.test(password);
    }

    /**
     * handlePasswordChange
     * 
     * Met à jour le mot de passe et effectue la validation en temps réel
     * @param {*} pwd - Nouvelle valeur du mot de passe
     */

    const handlePasswordChange = (pwd) => {
        setPassword(pwd);
        if (!validatePassword(pwd)) {
            setError("Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un caractère spécial.");
        } else {
            setError("");
        }
    }

    /**
     * handleSignup
     * 
     * Fonction appelée lors de la soumission du formulaire
     * - Empêche le rechargement de la page
     * - Vérifie la correspondance des mots de passe
     * - Valide le mot de passe
     * - Envoie une requête POST au backend pour créer l'utilisateur
     * - Affiche la popup de succès sur l'inscription réussit
     * 
     * @param {React.FormEvent>HTMLFormElement} e - Evènement de soumission du formulaire
     */

    const handleSignup = async(e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        console.log("Form submitted");
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un caractère spécial.");
            return;
        }

        try {
            const response = await axiosClient.post("/users/signup", {
                first_name: name,
                last_name: lastName,
                company,
                email,
                password,
            });

            if (response.data.success) {
                // navigate("/login")
                setShowSuccessPopup(true);
            } else {
                setError(response.data.message || "Erreur lors de l'inscription.");
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 422) {
                    // Validation Pydantic a échoué, on affiche le message
                    const detail = err.response.data.detail;
                    if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
                        setError(detail[0].msg);
                    } else {
                        setError("Erreur de validation du formulaire");
                    }
                } else if (err.response.data.detail) {
                    setError(err.response.data.detail);
                } else {
                    setError("Erreur lors de l'inscription.");
                }
            } else {
                setError("Erreur réseau ou serveur.");
            }
        }
    };

    return (
            <div className='card login-signup-card'>

                <img src="./avatar/signup_avatar.png" alt="Avatar" className='avatar' />
                <h2 className='title'>INSCRIPTION</h2>

                <form onSubmit={handleSignup}>

                    <InputField
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Prénom"
                        required={true}
                    />

                    <InputField
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nom de famille"
                        required={true}
                    />

                    <InputField
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Entreprise (facultatif)"
                        required={false}
                    />

                    <InputField
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Adresse mail"
                        required={true}
                    />

                    <PasswordInput
                        password={password}
                        setPassword={handlePasswordChange}
                        placeholder="Mot de passe"
                    />

                    <PasswordInput
                        password={confirmPassword}
                        setPassword={setConfirmPassword}
                        placeholder="Confirmer le mot de passe"
                    />

                    <ButtonSubmit
                        text="S'INSCRIRE"
                        onClick={handleSignup}
                        disabled={false}
                    />

                    {/* Message d'information ou d'erreur */}
                    {error && <p className='login-message'>{error}</p>}

                    <span className='message'>Déjà inscrit ?</span>

                </form>

                <ButtonRedirect
                className=""
                text="CONNECTEZ-VOUS"
                to="/login"
                disbaled={false}
                />

                {showSuccessPopup && (
                    <Popup onClose={() => setShowSuccessPopup(false)}>
                        <h2>Inscription réussie ! 🎉</h2>
                        <ButtonRedirect
                            text="SE CONNECTER"
                            to="/login"
                            disabled={false}
                        />
                    </Popup>
                )}

            </div>
    )
}