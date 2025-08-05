import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './Login.css'
import '../../App.css'

// Créer le composant Login
function Login(){
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  // Déclaration des états (useSate --> initialise la valeur à une chaîne vide ; set... --> change la valeur)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  //handleSubmit sera la fonction exécutée quand on clique sur "Se connecter"
      // bloque le rechargement par défaut
      // envoie une requête POST à /login avec email et password
      // affiche le message retourné par le backend, ou message d'erreur si ça échoue
  const handleSubmit = async(e) => {
    e.preventDefault();//empêche le rechargement automatique du formulaire
    setMessage('');
    try{
        console.log('handleSubmit called');
        const response = await axiosClient.post('/login', {
            email: email,
            password: password
        });
        console.log('Réponse reçue', response.data);
        if (response.status === 200) {
          navigate('/dashboard');
        }

        if (response.data.success) {
          setMessage('');
        } else {
          setMessage(response.data.message || '');
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
            setMessage(error.response.data.message);
        } else {
            setMessage('Erreur lors de la connexion')
        }
    }
  };

  return(
    <div className='login-container'>

      {/* Top bar */}
      <div className='top-bar'>
        <img src='/logo.png' alt='Logo' className="logo" />
        <span className='site-name'>Labelia</span>
      </div>

      {/* Page de contenu */}
      <div className='login-page'>
        <div className='login-card'>
          <img src='/login_avatar.png' alt='Avatar' className='login-avatar' />
          <h2 className='login-title'>CONNEXION</h2>

          <form onSubmit={handleSubmit} className='login-form'>

            <input type="email" placeholder='Addresse mail' className='login-input' value={email} onChange={e => setEmail(e.target.value)} required/>

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                className="password-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Afficher ou masquer le mot de passe"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#3B82F6" viewBox="0 0 24 24">
                    <path d="M12 6.5c-4.14 0-7.68 2.56-9.2 6.5 1.52 3.94 5.06 6.5 9.2 6.5s7.68-2.56 9.2-6.5c-1.52-3.94-5.06-6.5-9.2-6.5zm0 11c-2.49 0-4.5-2.01-4.5-4.5S9.51 8.5 12 8.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#3B82F6" viewBox="0 0 24 24">
                    <path d="M12 6.5c-4.14 0-7.68 2.56-9.2 6.5.76 1.96 2.12 3.62 3.88 4.76L4 21l1.41 1.41L20.5 5.91 19.09 4.5l-3.15 3.15C14.7 7.2 13.38 6.5 12 6.5zm-6.83 6.5c1.08-2.27 3.44-4 6.83-4 1.04 0 2.03.25 2.9.7L5.17 13zm12.7-4.83L9.17 16c.93.36 1.94.55 2.83.55 3.39 0 5.75-1.73 6.83-4-.45-1.12-1.18-2.1-2.13-2.88z" />
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" className='login-button'>
              SE CONNECTER
            </button>
            {message && <p className='login-message'>{message}</p>}
            <p className='signup-message'>Pas encore inscrit ?</p>
            <Link to="/signup" className='signup-link'>
                <button className='signup-button'>INSCRIVEZ-VOUS</button>
            </Link>
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Login;//exporte le composant pour l'utiliser dans App.js