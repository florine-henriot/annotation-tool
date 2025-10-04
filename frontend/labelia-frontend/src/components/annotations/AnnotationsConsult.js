import React from "react";
import "./AnnotationsConsult.css";

export default function AnnotationsConsult({ annotations, onSelect }) {
  const nullContent = (annotations || []).filter(a => a.content === null);
  const filledContent = (annotations || []).filter(a => a.content !== null);

  // petite fonction utilitaire pour retrouver l'index global dans annotations
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
                onClick={() => onSelect(getIndexById(a.id))} // ✅ clic
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
                onClick={() => onSelect(getIndexById(a.id))} // ✅ clic
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