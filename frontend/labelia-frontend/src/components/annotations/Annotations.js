import React, { useState, useEffect } from "react";
import "./Annotations.css";
import AnnotationsConsult from "./AnnotationsConsult";
import Annotate from "./Annotate";
import axiosClient from "../api/axiosClient";
import Loading from "../common/Loading";

export default function Annotations({ project }) {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnotations = async () => {
      try {
        const response = await axiosClient.get(`/annotations/${project.id}/annotate`);
        // Trier par row_id pour que l'ordre reste le même
        const data = (response.data.annotations || []).sort((a, b) => a.row_id - b.row_id);
        setAnnotations(data);
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
        <AnnotationsConsult annotations={annotations} />
      </div>
      <div className="cell-annotate">
        <Annotate
          projectId={project.id}
          projectCategories={project.categories}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </div>
      <div className="cell-annotate">Action buttons</div>
    </div>
  );
}