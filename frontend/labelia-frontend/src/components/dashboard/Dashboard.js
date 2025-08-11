import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch("http://localhost:8000/protected", {
      method: "GET",
      credentials: "include" // important pour envoyer le cookie
    })
    .then(res => {
      if (!res.ok) throw new Error('Non authentifié');
      return res.json();
    })
    .then(data => setMessage(data.message))
    .catch(err => setMessage(err.message));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
      {/* Ici tu peux rajouter ta barre de navigation */}
    </div>
  );
}

export default Dashboard;