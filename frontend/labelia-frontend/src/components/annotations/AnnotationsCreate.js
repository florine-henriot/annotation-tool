import React, { useState } from 'react';
import TopBar from '../topbar/TopBar';
import SideBar from '../sidebar/Sidebar';
import SidebarFooter from '../sidebar_footer/SidebarFooter';
import './AnnotationsCreate.css'
import RichTextEditor from '../../text_editor/RichTextEditor';
import { FilePlus } from 'lucide-react';

function AnnotationsCreate() {
    const [annotationFile, setAnnotationFile] = useState(null);
    const [guidelinesFile, setGuidelinesFile] = useState(null);
    const [notes, setNotes] = useState('');

    const handleAnnotationFileChange = (e) => {
        setAnnotationFile(e.target.files[0]);
    };

    const handleGuidelinesFileChange = (e) => {
        setGuidelinesFile(e.target.files[0]);
    };

    return (
        <div className='annotations-create-container'>
            <TopBar pageTitle={"Annotations > Créer un projet d'annotations"} />
            <SideBar />
            <SidebarFooter />
            <div className='annotations-create-page'>
                <div className='annotations-create-card'>
                    <h2 className='annotations-create-title'>CRÉER UN NOUVEAU PROJET D'ANNOTATIONS</h2>

                    <form className='annotations-create-form'>

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

                        {/* Section pour insérer les fichiers */}
                        <h2 className='section-title'>FICHIERS</h2>

                        <label className='file-upload-btn'>
                            <FilePlus size={18} style={{marginRight: "8px"}}/>
                            Fichier à annoter (CSV)
                            <input
                            type="file"
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
                            accept=".pdf"
                            onChange={handleGuidelinesFileChange}
                            hidden />
                        </label>

                        {guidelinesFile && <p className="file-name">{guidelinesFile.name}</p>}

                        {/* Section pour entrer des notes avec React Quill */}
                        <h2 className='section-title'>NOTES (FACULTATIF)</h2>

                        <RichTextEditor value={notes} onChange={setNotes} />

                        <button type="submit" className='create-button'>
                            CREER
                        </button>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default AnnotationsCreate;