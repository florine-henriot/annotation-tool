import React, { useState} from 'react';
import axiosClient from '../../api/axiosClient';
import { Link, useNavigate } from 'react-router-dom';


import './Signup.css'
import '../../App.css'

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [company, setCompany] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        console.log("Form submitted");
        setError("");
        setSuccess(false);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await axiosClient.post("/signup", {
                first_name: name,
                last_name: lastName,
                company,
                email,
                password,
            });

            if (response.data.success) {
                setSuccess(true);
                // navigate("/login")
                setShowSuccessPopup(true);
            } else {
                setError(response.data.message || "Erreur lors de l'inscription.");
            }
        } catch (err) {
            if (err.response && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Erreur lors de l'inscription.");
            }
        }
    };

    return (
        <div className='signup-container'>

            {/* --- Barre de navigation supérieure --- */}
            <div className='top-bar'>
                <img src='/logo.png' alt='Logo' className='logo' />
                <span className='site-name'>Labelia</span>
            </div>

            {/* Section principale de la page de connexion */}
            <div className='signup-page'>
                <div className='signup-card'>
                    <img src='/signup_avatar.png' alt='Avatar' className='signup-avatar' />
                    <h2 className='login-title'>INSCRIPTION</h2>

                    <form onSubmit={handleSubmit} className='signup-form'>

                        {/* Champ prénom */}
                        <input
                        type="text"
                        placeholder='Prénom'
                        className='signup-input'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />

                        {/* Champ nom */}
                        <input
                        type="text"
                        placeholder='Nom'
                        className='signup-input'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        />

                        {/* Champ entreprise */}
                        <input
                        type="text"
                        placeholder='Entreprise (facultatif)'
                        className='signup-input'
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        />

                        {/* Champ email */}
                        <input
                        type="email"
                        placeholder='Adresse mail'
                        className='signup-input'
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

                        {/* Champ confirmation mot de passe avec bouton pour l'afficher/masquer */}
                        <div className='password-container'>
                            <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Confirmer mot de passe'
                            className='password-input'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            />
                            <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label="Afficher ou masquer le mot de passe"
                            >
                                {showConfirmPassword ? (
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
                        <button type="submit" className="signup-button">
                            S'INSCRIRE
                        </button>

                        {/* Redirection vers l'inscription */}
                        <p className="login-redirection-message">Déjà inscrit ?</p>
                        <Link to="/login" className='login-redirection'>
                            CONNECTEZ-VOUS
                        </Link>
                        {/* <button className="login-redirection">CONNECTEZ-VOUS</button> */}
                    </form>

                    {error && <p className='error-message'>{error}</p>}

                    {showSuccessPopup && (
                        <div className='popup-overlay'>
                            <div className='popup-content'>
                                <h2>Inscription réussie ! 🎉</h2>
                                <button onClick={() => navigate("/login")} className='popup-button'>
                                    CONNECTEZ-VOUS
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

export default Signup;