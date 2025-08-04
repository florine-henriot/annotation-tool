import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function TestApi() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appel GET vers la route racine de ton API FastAPI
    axiosClient.get('/')
      .then(response => {
        setMessage(response.data.message || 'Réponse reçue !');
      })
      .catch(err => {
        setError('Erreur lors de la requête API');
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h2>Test API</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default TestApi;