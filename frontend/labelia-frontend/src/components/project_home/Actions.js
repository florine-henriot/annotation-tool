import ButtonSubmit from "../common/ButtonSubmit";
import axiosClient from "../api/axiosClient";
import React from "react";
import Popup from "../common/Popup";
import ButtonRedirection from "../common/ButtonRedirection";
import "./Actions.css";

export default function ActionsButtons({ project }) {
  const [pdfBlob, setPdfBlob] = React.useState(null);
  const [pdfDisabled, setDisabled] = React.useState(false);
  const [showGuidelines, setShowGuidelines] = React.useState(false);
  const [showNotes, setShowNotes] = React.useState(false);

  React.useEffect(() => {
    // Met à jour le bouton seulement si project change
    setDisabled(!project.guidelines_file_path);
  }, [project]);

  console.log(project.guidelines_file_path);

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
                text="Annoter"
                to={`/annotations/${project.id}/annotate`}
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