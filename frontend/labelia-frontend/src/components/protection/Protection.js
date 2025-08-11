import React, { useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function ProtectedPage() {
  useEffect(() => {
    axiosClient.get('/protected')
      .then(res => {
        console.log('Données protégées:', res.data);
      })
      .catch(err => {
        console.error('Erreur accès protégé:', err.response?.data || err.message);
      });
  }, []);

  return <div>Page protégée, check la console.</div>;
}

export default ProtectedPage;