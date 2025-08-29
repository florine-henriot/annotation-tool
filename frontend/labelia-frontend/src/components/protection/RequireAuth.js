import React, { Children, useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import './Protection.css';

function ProtectedPage({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/auth/protected', { withCredentials: true })
      .then(res => {
        console.log('Données protégées:', res.data);
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur accès protégé:', err.response?.data || err.message);
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (!authenticated) {
    return (
      <div className='protection-container'>

        {/* --- Barre de navigation supérieure --- */}
        <div className='top-bar'>
          <img src='/avatar/logo.png' alt='Logo' className='logo' />
          <span className='site-name'>Labelia</span>
        </div>

        {/* Section principale pour renvoyer à la page de connexion */}
        <div className='protection-page'>
          <div className='protection-card'>
            <h2 className='protection-title'>DÉCONNECTÉ</h2>

            <p className='protection-p'>Vous devez être connecté pour accéder à votre espace.</p>

            <button className='login-button' onClick={() => navigate('/login')}>PAGE DE CONNEXION</button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <>{children}</>
  );
}

export default ProtectedPage;