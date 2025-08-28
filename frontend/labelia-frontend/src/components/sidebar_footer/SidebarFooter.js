import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, CircleX, User } from 'lucide-react';
import axiosClient from '../../api/axiosClient'
import './SidebarFooter.css'; // ou un fichier CSS commun sidebar

function SidebarFooter() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/login")
  }

  const handleLogout = async () => {
    try {
        await axiosClient.post('/auth/logout', {}, {withCredentials: true});

        setShowPopup(true);

        setTimeout(() => {
            setShowPopup(false);
            navigate("/login")
        }, 2000);
    } catch (err) {
        console.error("Erreur lors de la déconnexion :", err);
    }
  };

  const handleAccount = () => {
    navigate('/account'); // redirige vers la page mon compte
  };

  return (
    <div className="sidebar-footer">
        <div className='sidebar-btn-container'>
            <button className="sidebar-btn" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onClick={handleLogout}>
                <Power size={20} />
            </button>
            {showTooltip && <span className='tooltip'>Se déconnecter</span>}
        </div>
      <button className="sidebar-btn account-btn" onClick={handleAccount}>
        <User size={18} style={{marginRight: "8px"}} />
        Mon compte
      </button>

      {showPopup && (
        <div className="popup-overlay">
            <div className='popup-content'>
                <CircleX className="close-icon" onClick={handleClosePopup} />
                <span >Vous allez être déconnecté.</span>
            </div>
        </div>
      )}
    </div>
  );
}

export default SidebarFooter;