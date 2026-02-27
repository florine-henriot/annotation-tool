import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import InputField from '../common/InputField';
import ButtonSubmit from '../common/ButtonSubmit';
import ButtonRedirect from '../common/ButtonRedirection';
import PasswordInput from './PasswordInput';
import "../../App.css";
import "./Form.css";

/**
 * LoginForm
 * 
 * Composant de formulaire de connexion.
 * Permet à un utilisateur de rentrer son email et mot de passe, d'envoyer
 * une requête de connexion au backend et de gérer l'état d'affichage
 * des messages d'erreur.
 * 
 * Utilise:
 * 
 * - InputField : composant pour champ email
 * - PasswordInput : composant pour le champ mot de passe
 * - ButtonSubmit : bouton pour soumettre le formulaire
 * - ButtonRedirect : bouton pour redirection vers la page d'inscription
 * 
 * @returns {JSX.Element} Formulaire de connexion avec gestion des 
 *      messages et redirection.
 */

export default function LoginForm() {
    const navigate = useNavigate();

    // Etats locaux du formulaire
    const [email, setEmail] = React.useState(''); // Adresse mail de l'utilisateur
    const [password, setPassword] = React.useState(''); // Mot de passe de l'utilisateur
    const [message, setMessage] = React.useState(''); // Message d'erreur ou d'information

    /**
     * handleLogin
     * 
     * Fonction déclenchée lors de la soumission du formulaire.
     * - Empêche le rechargement de la page
     * - Envoie une requête POST à auth/login avec email et password
     * - Si la connexion réussit, teste un endpoint protégé et redirige vers le dashboard
     * - Sinon, affiche le message d'erreur renvoyé par le backend
     * 
     * @param {React.FormEvent>HTMLFormElement} e - Evènement de soumission du formulaire
     */

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/auth/login', {
                email,
                password
            },
        { withCredentials: true});

            if (response.status === 200 && response.data.success) {
                // Login réussi, token en cookie est set

                // Test accès protégé
                const protectedRes = await axiosClient.get('/auth/protected');
                console.log("Accès protégé OK:", protectedRes.data);
                
                navigate('/dashboard'); // Redirige si la connexion réussit
            } else {
                setMessage(response.data.message || 'Erreur inconnue.');
            }

        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.detail) {
                setMessage(error.response.data.detail);
            } else {
                setMessage('Erreur lors de la connexion.');
            }
        }
    };


    return (
        <div className='card login-signup-card'>

            <img src="./avatar/login_avatar.png" alt="Avatar" className='avatar' />
            <h2 className='title'>CONNEXION</h2>

            <form onSubmit={handleLogin}>

                <InputField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse mail"
                    required={true}
                />

                <PasswordInput
                    password={password}
                    setPassword={setPassword}
                    placeholder="Mot de passe"
                />

                <ButtonSubmit
                    text="SE CONNECTER"
                    onClick={handleLogin}
                    disabled={false}
                />

                {/* Message d'information ou d'erreur */}
                {message && <p className='login-message'>{message}</p>}

                <button className="forgotten-password">Mot de passe oublié ?</button>


            </form>


            <span className='message'>Pas encore inscrit ?</span>
            
            <ButtonRedirect
                className=""
                text="INSCRIVEZ-VOUS"
                to="/signup"
                disabled={false}
            />

        </div>
    )

}