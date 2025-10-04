import React, { useState, useEffect } from "react";
import "./Annotations.css";
import AnnotationsConsult from "./AnnotationsConsult";
import Annotate from "./Annotate";
import axiosClient from "../api/axiosClient";
import Loading from "../common/Loading";
import ActionsButtonsAnnotations from "./ActionsAnnotations";

/**
 * Annotations
 * 
 * Composant principal de la page d'annotation.
 * 
 * Ce composant gère : 
 * - le chargement des phrases à annoter depuis le backend
 * - l'état des annotations et de leur index
 * - l'affiche du panneau qui permet de voir la liste des annotations
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.project - Le projet sélectionné
 * @param {number|string} props.project.id - L'identifiant du projet
 * @param {string} props.project.project_name - le nom du projet
 * @param {string[]} props.project.categories - Les catégories disponibles pour l'annotation
 *  
 * @returns {JSX.Element} Interface de saisie des annotations
 */
export default function Annotations({ project }) {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 

  /**
   * Récupère les annotations du projet depuis le backend à l'initialisation.
   * - Trie les annotations selon leur row_id pour conserver l'ordrer
   * - Initialise currentIndex sur la première phrase non annotée
   */
  useEffect(() => {
    const fetchAnnotations = async () => {
      try {
        const response = await axiosClient.get(`/annotations/${project.id}/annotate`);
        const data = (response.data.annotations || []).sort((a, b) => a.row_id - b.row_id);
        setAnnotations(data);

        // on initialise l'index sur la première annotation non remplie
        const firstUnannotatedIndex = data.findIndex(a => !a.content);
        setCurrentIndex(firstUnannotatedIndex !== -1 ? firstUnannotatedIndex : 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des annotations :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnotations();
  }, [project.id]);

  if (loading) return <Loading />;

  return (
    <div className="container-annotate">
      <div className="cell-title-annotate wide-annotate">
        <h2 className="project-title">{project.project_name}</h2>
      </div>

      <div className="cell cell-left-merge">
        <AnnotationsConsult
          annotations={annotations}
          onSelect={index => setCurrentIndex(index)}   
        />
      </div>

      <div className="cell-annotate">
        <Annotate
          projectId={project.id}
          projectCategories={project.categories}
          annotations={annotations}
          setAnnotations={setAnnotations}
          currentIndex={currentIndex}                 
          setCurrentIndex={setCurrentIndex}
        />
      </div>

      <div className="cell-annotate">
          <ActionsButtonsAnnotations project={project} />
      </div>

    </div>
  );
}
