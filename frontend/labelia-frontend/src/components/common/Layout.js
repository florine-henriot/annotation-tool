import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children, pageTitle, icon:Icon }) {
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