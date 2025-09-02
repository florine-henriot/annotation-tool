import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import TopBar from "../topbar/TopBar";
import SideBar from "../sidebar/Sidebar";
import SidebarFooter from "../sidebar_footer/SidebarFooter";
import "./ProjectHome.css";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

function ProjectDetails() {
  const { projectId } = useParams(); // récupère l'ID depuis l'URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosClient.get(`/annotations/${projectId}`);
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Erreur lors du chargement du projet");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  
  // Répartition des catégories
  const categoryData = project.categories.map((cat) => {
    const count = project.annotations.filter(a => a.content === cat).length;
    return { name: cat, value: count, color: getCategoryColor(cat) };
  });

  // Ajouter une catégorie "Non annoté"
  const nonAnnotatedCount = project.annotations.filter(a => !a.content).length;
  if (nonAnnotatedCount > 0) {
    categoryData.push({ name: "Non annoté", value: nonAnnotatedCount, color: "#E5E7EB" });
  }

  // Fonctions pour récupérer la couleur d'une catégorie
  function getCategoryColor(cat) {
    const colors = ["#48e8a5", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];
    const index = project.categories.indexOf(cat) % colors.length;
    return colors[index];
  }

  // Construction de annotationsByDay
  const annotationsByDay = project.annotations.reduce((acc, a) => {
    if (a.date) {
      const day = new Date(a.date).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="project-container">
      <TopBar pageTitle={`Projet > ${project.project_name}`} />
      <SideBar />
      <SidebarFooter />

      <div className="project-page">

        <div className="project-title-card">
          <h2 className="project-title">
            {project.project_name}
          </h2>

          <div className="progress-container">
            <div className="progress-bar-project">
              <div className="progress-fill-project"
                style={{ width: `${project.completion || 0}%` }}>
              </div>
            </div>

            <span className="progress-text">
                {project.completion || 0} %
            </span>
          </div>
        </div>

      <div className="project-stats-container">
        {/* Colonne 1 : Camembert */}
        <div className="chart-card card">
          <h3>Répartition des catégories</h3>
          <PieChart width={200} height={200}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Colonne 2 : Calendrier */}
        <div className="calendar-card card">
          <h3>Calendrier des annotations</h3>
          <Calendar
            tileClassName={({ date, view }) => {
              const dayAnnotations = annotationsByDay[date.toISOString().split('T')[0]];
              return dayAnnotations ? "highlighted-day" : null;
            }}
          />
        </div>

        {/* Colonne 3 : Date d'échéance + Moyenne annotations/jour */}
        <div className="right-cards">
          <div className="due-date-card card">
            <h4>Date d’échéance</h4>
            <p>{project.due_date}</p>
          </div>

          <div className="avg-annotations-card card">
            <h4>Moyenne annotations / jour</h4>
            <p>
              {(() => {
                const totalAnnotations = project.annotations.filter(a => a.content).length;
                const annotatedDates = project.annotations
                  .filter(a => a.date)
                  .map(a => new Date(a.date));
                const firstDate = annotatedDates.length ? new Date(Math.min(...annotatedDates)) : new Date();
                const daysElapsed = Math.max((new Date() - firstDate)/(1000*60*60*24), 1);
                return Math.round(totalAnnotations / daysElapsed);
              })()}
            </p>
          </div>
        </div>
      </div>
      </div>

      <div className="project-actions">
      {/* Bouton Guidelines */}
      <button
        className="action-button"
        disabled={!project.guidelines_file_path} // non cliquable si pas de guidelines
        onClick={() => setShowGuidelines(true)}
      >
        Consulter les guidelines
      </button>

      {/* Bouton Notes */}
      <button
        className="action-button"
        onClick={() => setShowNotes(true)}
      >
        Consulter mes notes
      </button>

      {/* Bouton Annoter */}
      <button
        className="action-button"
        onClick={() => navigate(`/annotations/annotate/${project.id}`)}
      >
        Annoter
      </button>
    </div>

      {/* Popup Guidelines */}
      {showGuidelines && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="close-popup" onClick={() => setShowGuidelines(false)}>✖</span>
            <iframe
              src={`${process.env.REACT_APP_API_URL}/uploads/${project.guidelines_file_path.split("\\").pop()}`}
              width="100%"
              height="600px"
              title="Guidelines"
            />
          </div>
        </div>
      )}

      {/* Popup Notes */}
      {showNotes && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="close-popup" onClick={() => setShowNotes(false)}>✖</span>
            <div dangerouslySetInnerHTML={{ __html: project.notes || "<p>Aucune note</p>" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;