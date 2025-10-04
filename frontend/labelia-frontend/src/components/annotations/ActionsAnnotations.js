import ButtonSubmit from "../common/ButtonSubmit";
import axiosClient from "../api/axiosClient";
import React from "react";
import Popup from "../common/Popup";
import ButtonRedirection from "../common/ButtonRedirection";
import "./ActionsAnnotations.css";


/**
 * ActionsButtonsAnnotations
 * 
 * Composant React affichant les boutons d'action pour un projet d'annotation.
 * 
 * Affiche trois boutons principaux : 
 * 1. Voir les guidelines : télécharge et ouvre le PDF des guidelines si disponible
 * 2. Consulter les notes : ouvre un popup contenant les notes HTML du projet
 * 3. Annoter : redirige l'utilisateur vers la page d'annotation.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.project - Object représentant un projet
 * @param {number} props.project.id - Identifiant unique du projet.
 * @param {string} [props.project.guidelines_file_path] - Chemin du fichier de guidelines PDF.
 * @param {string} [props.project.notes] - Notes associées au projet HTML
 * 
 * @example
 * <ActionsButtons project={project} />
 *  
 * @returns {JSX.Element} Un conteneur avec les boutons d'action et les popups associées.
 */
export default function ActionsButtonsAnnotations({ project }) {
  const [pdfBlob, setPdfBlob] = React.useState(null);
  const [pdfDisabled, setDisabled] = React.useState(false);
  const [showGuidelines, setShowGuidelines] = React.useState(false);
  const [showNotes, setShowNotes] = React.useState(false);

  /**
   * Active ou désactive le bouton Voir les guidelines selon la présence d'un fichier.
   */
  React.useEffect(() => {
    // Met à jour le bouton seulement si project change
    setDisabled(!project.guidelines_file_path);
  }, [project]);

  /**
   * Télécharge le PDF des guidelines et crée un URL blob pour afficher un iframe.
   * 
   * @async
   * @function fetchPDF
   * @returns {Promise<void>}
   */
  const fetchPDF = async () => {
    try {
      const response = await axiosClient.get(
        `/uploads/${project.guidelines_file_path.split(/[/\\]/).pop()}`,
        { responseType: "blob" }
      );
      const fileURL = URL.createObjectURL(response.data);
      setPdfBlob(fileURL);
    } catch (err) {
      console.error("Erreur téléchargement PDF :", err);
    }
  };

  // === Rendu composant ===
  return (
    <div className="actions-buttons-wrapper">
        <div className="actions-buttons-container">
            <ButtonSubmit
            text="Voir les guidelines"
            onClick={async () => {
                await fetchPDF();
                setShowGuidelines(true);
            }}
            disabled={pdfDisabled}
            />

            <ButtonSubmit
                text="Consulter les notes"
                onClick={() => setShowNotes(true)}
                disabled={false}
            />

            <ButtonRedirection
                text="Retour au projet"
                to={`/annotations/${project.id}`}
            />

            {showGuidelines && pdfBlob && (
                <Popup onClose={() => setShowGuidelines(false)}>
                    <iframe
                    src={pdfBlob}
                    style={{ width: '60vw', height: '80vh', border: 'none' }}
                    />
                </Popup>
            )}

            {showNotes && (
                <Popup onClose={() => setShowNotes(false)}>
                    <div dangerouslySetInnerHTML={{ __html: project.notes || "<p>Aucune note</p>" }} />
                </Popup>
            )}
        </div>
    </div>
  );
}