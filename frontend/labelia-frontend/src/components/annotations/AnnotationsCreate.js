import React, { useState } from 'react';
import TopBar from '../topbar/TopBar';
import SideBar from '../sidebar/Sidebar';
import SidebarFooter from '../sidebar_footer/SidebarFooter';
import './AnnotationsCreate.css'
import RichTextEditor from '../../text_editor/RichTextEditor';
import { FilePlus } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AnnotationsCreate() {
    const [annotationFile, setAnnotationFile] = useState(null);
    const [guidelinesFile, setGuidelinesFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleAnnotationFileChange = (e) => {
        setAnnotationFile(e.target.files[0]);
    };

    const handleGuidelinesFileChange = (e) => {
        setGuidelinesFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // empeche le refresh de la page

        // Construire le FormData pour envoyer les fichiers et les nots
        const formData = new FormData();
        formData.append("project_name", e.target.project_name.value);
        formData.append("due_date", e.target.due_date.value);
        formData.append("annotation_file", annotationFile);
        if (guidelinesFile) formData.append("guidelines_file", guidelinesFile);
        formData.append("notes", notes);
        formData.append("categories", e.target.categories.value)

        try {
            const response = await axiosClient.post("/annotations/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Projet crée :", response.data);
            setShowPopup(true);
            setTimeout(() => {
                navigate("/dashboard")
            }, 3000);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    }

    const handleClosePopup = () => {
        setShowPopup(false);
        navigate("/dashboard")
    }

    return (
        <div className='annotations-create-container'>
            <TopBar pageTitle={"Annotations > Créer un projet d'annotations"} />
            <SideBar />
            <SidebarFooter />
            <div className='annotations-create-page'>
                <div className='annotations-create-card'>
                    <h2 className='annotations-create-title'>CRÉER UN NOUVEAU PROJET D'ANNOTATIONS</h2>

                    <form className='annotations-create-form' onSubmit={handleSubmit}>

                        {/* Section d'informations générales sur le projet */}
                        <h2 className='section-title'>INFORMATIONS GÉNÉRALES</h2>

                        <input 
                        className='annotations-create-input' 
                        type="text" 
                        name="project_name" 
                        placeholder='Nom du projet'
                        required />

                        <input
                        className="annotations-create-input"
                        type="text"                     // pour afficher ton "placeholder" initial
                        placeholder="Date d'échéance"
                        name="due_date"
                        required
                        onFocus={e => {
                            e.target.type = "date";       // transforme en date au focus
                            e.target.showPicker?.();       // ouvre automatiquement le calendrier si supporté
                        }}
                        onBlur={e => {
                            if (!e.target.value) {
                            e.target.type = "text";     // remet type text si vide pour afficher placeholder
                            }
                        }}
                        />

                        <input className='annotations-create-input'
                        type='text'
                        placeholder='Entrez les catégories séparées par des virgules'
                        name="categories"
                        required />

                        {/* Section pour insérer les fichiers */}
                        <h2 className='section-title'>FICHIERS</h2>

                        <label className='file-upload-btn'>
                            <FilePlus size={18} style={{marginRight: "8px"}}/>
                            Fichier à annoter (CSV)
                            <input
                            type="file"
                            name="annotation_file"
                            accept=".csv"
                            onChange={handleAnnotationFileChange}
                            hidden
                            required />
                        </label>

                        {annotationFile && <p className="file-name">{annotationFile.name}</p>}

                        <label className='file-upload-btn'>
                            <FilePlus size={18} style={{marginRight: "8px"}}/>
                            Guidelines d'annotations (facultatif) (PDF)
                            <input
                            type="file"
                            name="guidelines_file"
                            accept=".pdf"
                            onChange={handleGuidelinesFileChange}
                            hidden />
                        </label>

                        {guidelinesFile && <p className="file-name">{guidelinesFile.name}</p>}

                        {/* Section pour entrer des notes avec React Quill */}
                        <h2 className='section-title'>NOTES (FACULTATIF)</h2>

                        <RichTextEditor value={notes} onChange={setNotes} />

                        <button type="submit" className='create-button'>
                            CRÉER
                        </button>

                    </form>

                </div>

                {showPopup && (
                <div className="popup-overlay">
                    <div className='popup-content'>
                        <CircleX className="close-icon" onClick={handleClosePopup} />
                        <span>Projet créé avec succès ! 🎉</span>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default AnnotationsCreate;