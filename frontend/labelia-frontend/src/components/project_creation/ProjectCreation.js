import './ProjectCreation.css';
import '../../App.css';
import React from 'react';
import InputField from '../common/InputField';
import { FilePlus } from 'lucide-react';
import RichTextEditor from '../common/TextEditor';
import ButtonSubmit from '../common/ButtonSubmit';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import Popup from '../common/Popup';

/**
 * ProjectCreation
 * 
 * Page permettant à l'utilisateur de créer un projet d'annotation.
 * 
 * Fonctionnalités : 
 * - Remplir un formulaire avec les informations du projet (nom, date, catégories, notes)
 * - Upload de fichiers (CSV obligatoire, PDF facultatif)
 * - Envoi des données via axios (multipart/form-data)
 * - Popup de foncormation en cas de succès
 * - Redirection automatique vers le tableau de bord
 * 
 * @returns 
 */

export default function ProjectCreation() {
    const navigate = useNavigate();

    // States pour stocker les valeurs du formulaire
    const [projectName, setProjectName] = React.useState("");
    const [categories, setCategories] = React.useState("");
    const [annotationFile, setAnnotationFile] = React.useState(null);
    const [guidelinesFile, setGuidelinesFile] = React.useState(null);
    const [notes, setNotes] = React.useState('');

    // Affichage conditionnel du popup de succès
    const [showPopup, setShowPopup] = React.useState(false);

    // Gestion du fichier CSV obligatoire
    const handleAnnotationFileChange = (e) => {
        setAnnotationFile(e.target.files[0]);
    };

    // Gestion du fichier PDF facultatif
    const handleGuidelinesFileChange = (e) => {
        setGuidelinesFile(e.target.files[0]);
    };

    /**
     * Envoi du formulaire au backend
     * - Construction d'un FormData (obligatoire pour uploader des fichiers)
     * - POST vers /annotations/create
     * - Affichage popup + redirection si succès
     * @param {*} e 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("project_name", projectName);
        formData.append("due_date", e.target.dueDate.value);
        formData.append("annotation_file", annotationFile);
        if (guidelinesFile) formData.append("guidelines_file", guidelinesFile);
        formData.append("notes", notes);
        formData.append("categories", categories);

        try {
            const response = await axiosClient.post("/annotations/create", formData, {
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            });
            console.log("Projet créé :", response.data);
            setShowPopup(true);
            setTimeout(() => {
                navigate("/dashboard")
            }, 3000);
        } catch (err) {
            console.error(err.response?.data || err.message)
        }
    };

    // Fermeture manuelle du popup (si l'utilisateur clique dessus)
    const handleClosePopup = () => {
        setShowPopup(false);
        navigate("/dashboard");
    };

    return (
        <div className="card project-creation-card">
            
            <h2 className="project-creation-title">Créer un projet d'annotation</h2>

            <form onSubmit={handleSubmit}>

                <h2 className='section-title'>Informations générales</h2>

                <InputField
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Nom du projet"
                    required={true}
                />

                <input 
                    className='input-field-date'
                    type="text"
                    placeholder="Date d'échéance"
                    name="dueDate"
                    required
                    onFocus={e => {
                        e.target.type = "date";
                        e.target.showPicker?.();
                    }}
                    onBlur={e => {
                        if (!e.target.value) {
                            e.target.type = "text";
                        }
                    }}
                />

                <InputField
                    type="text"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    placeholder="Catégories, séparées par virgule"
                    required={true}
                />

                <h2 className='section-title'>Fichiers</h2>

                <label className='file-upload-btn'>
                    <FilePlus size={18} style={{marginRight: "8px"}} />
                    Fichier à annoter (CSV)
                    <input
                        type="file"
                        name="annotation_file"
                        accept=".csv"
                        onChange={handleAnnotationFileChange}
                        hidden
                        required
                    />
                </label>

                {annotationFile && <p className='file-name'>{annotationFile.name}</p>}

                <label className='file-upload-btn'>
                    <FilePlus size={18} style={{marginRight: "8px"}} />
                    Guidelines d'annotations (facultatif) (PDF)
                    <input 
                        type="file"
                        name="guidelines_file"
                        accept=".pdf"
                        onChange={handleGuidelinesFileChange}
                        hidden
                    />
                </label>

                {guidelinesFile && <p className='file-name'>{guidelinesFile.name}</p>}

                <h2 className='section-title'>Notes (facultatif)</h2>

                <RichTextEditor value={notes} onChange={setNotes} />

                <ButtonSubmit 
                    text="Créer"
                />

            </form>

            {showPopup && (
                <Popup onClose={handleClosePopup}>
                    <h2>Projet créé avec succès ! 🎉</h2>
                </Popup>
            )}

        </div>
    )
}