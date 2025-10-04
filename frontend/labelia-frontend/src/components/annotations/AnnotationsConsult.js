import React from "react";
import "./AnnotationsConsult.css";

/**
 * AnnotationsConsult
 * 
 * Composant d'affichage et de consultation des annotations.
 * 
 * Ce composant présente deux tableaux :
 * - Les textes sans annotations
 * - Les textes avec annotations
 * 
 * Chaque ligne est cliquable et permet de sélectionner la phrase correspondante dans 
 * le module principal d'annotation.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {Array<Object>} props.annotations - Liste complète des annotations du projet
 * @param {function(number): void} props.onSelect - Fonction appelée lorsqu'un texte est sélectionné.
 * 
 * @returns {JSX.Element} Une interface en deux tableaux pour consulter les textes annotés et non-annotés.
 */
export default function AnnotationsConsult({ annotations, onSelect }) {
  // Sépare les annotations selons leur état
  const nullContent = (annotations || []).filter(a => a.content === null);
  const filledContent = (annotations || []).filter(a => a.content !== null);

  /**
   * Retrouve l'index global d'une annotation dans le tableau d'origine à partir de son identifiant
   * 
   * @param {number} id Identifiant de l'annotation
   * 
   * @returns {number} Index global de l'annotation
   */
  const getIndexById = id => annotations.findIndex(a => a.id === id);

  return (
    <div className="annotations-consult">
      <div className="annotations-subtitle">Textes sans annotations</div>
      <div className="table-wrapper">
        <table className="annotations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Texte</th>
            </tr>
          </thead>
          <tbody>
            {nullContent.map(a => (
              <tr
                key={a.id}
                onClick={() => onSelect(getIndexById(a.id))} 
                style={{ cursor: "pointer" }}
              >
                <td>{a.id}</td>
                <td>{a.text.substring(0, 45)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="annotations-subtitle">Textes avec annotations</div>
      <div className="table-wrapper">
        <table className="annotations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Texte</th>
            </tr>
          </thead>
          <tbody>
            {filledContent.map(a => (
              <tr
                key={a.id}
                onClick={() => onSelect(getIndexById(a.id))} 
                style={{ cursor: "pointer" }}
              >
                <td>{a.id}</td>
                <td>{a.text.substring(0, 45)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}