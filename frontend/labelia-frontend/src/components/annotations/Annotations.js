import React from "react";
import "./Annotations.css";
import AnnotationsConsult from "./AnnotationsConsult";

export default function Annotations({ project }) {
  return (
    <div className="container-annotate">
        <div className="cell-title-annotate wide-annotate">
            <h2 className="project-title">
                {project.project_name}
            </h2>
        </div>
        <div className="cell cell-left-merge">
            <AnnotationsConsult projectId={project.id} />
        </div>
        <div className="cell-annotate">
            Cell for annotations
        </div>
        <div className="cell-annotate">
            Action buttons
        </div>
    </div>
  );
}