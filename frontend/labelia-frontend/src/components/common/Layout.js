import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Layout
 * 
 * Gère la structure principale de l'application incluant :
 * - la Topbar avec le titre de la page et une icône facultative,
 * - la Sidebar avec les liens de navigation,
 * - le bouton de toggle pour ouvrir la sidebar (mobile)
 * - le contenu principal (children)
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu principal à afficher dans le layout
 * @param {string} props.pageTitle - Titre de la page affiché dans la topbar
 * @param {React.Component} props.icon - Icône facultative à afficher à côté du titre de la page
 *  
 * @returns {JSX.Element} Le layout complet avec Topbar, Sidebar et contenu principal
 */

export default function Layout({ children, pageTitle, icon:Icon }) {
  // Etat pour savoir si la sidebar est ouverte ou fermée (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Topbar icon={Icon} pageTitle={pageTitle}/>

      {/* Bouton "ouvrir sidebar" (visible seulement en mobile grâce au CSS) */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}