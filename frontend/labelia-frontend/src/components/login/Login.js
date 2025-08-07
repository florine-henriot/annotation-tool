import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './Login.css'
import '../../App.css'


/**
 * Composant de connexion utilisateur (login).
 * Gère l'affichage du formulaire et la logique de soumissions.
 */

function Login() {
    const navigate = useNavigate();

    // === Etats ===
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    /**
     * Gère la soumission du formulaire de connexion
     * Envoie les identifiants au backend via axiosClient
     * Si succès, redirige vers le dashboard, sinon affiche un message d'erreur
     */

    const handleSubmit = async(e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setMessage('');

        try {
            const response = await axiosClient.post('/login', {
                email,
                password
            });

            if (response.status === 200 && response.data.success) {
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
        <div className='login-container'>

            {/* --- Barre de navigation supérieure --- */}
            <div className='top-bar'>
                <img src='/logo.png' alt='Logo' className='logo' />
                <span className='site-name'>Labelia</span>
            </div>

            {/* Section principale de la page de connexion */}
            <div className='login-page'>
                <div className='login-card'>
                    <img src='/login_avatar.png' alt='Avatar' className='login-avatar' />
                    <h2 className='login-title'>CONNEXION</h2>

                    <form onSubmit={handleSubmit} className='login-form'>

                        {/* Champ email */}
                        <input
                        type="email"
                        placeholder='Adresse mail'
                        className='login-input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />

                        {/* Champ mot de passe avec bouton pour l'afficher/masquer */}
                        <div className='password-container'>
                            <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Mot de passe'
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

                        {/* Bouton de connexion */}
                        <button type="submit" className="login-button">
                            SE CONNECTER
                        </button>

                        {/* Message d'erreur ou d'information */}
                        {message && <p className='login-message'>{message}</p>}
                        
                        {/* Redirection vers l'inscription */}
                        <p className="signup-message">Pas encore inscrit ?</p>
                        <Link to='/signup' className='signup-link'>
                            <button className="signup-button">INSCRIVEZ-VOUS</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;