import React from "react";
import "./Annotate.css";
import Loading from "../common/Loading";
import axiosClient from "../api/axiosClient";

export default function Annotate({projectId, projectCategories}) {

    const [annotations, setAnnotations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    // Index de la phrase en cours
    const [currentIndex, setCurrentIndex] = React.useState(0);
    
    const [open, setOpen] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState("");
    const dropdownRef = React.useRef(null);

    const toggleDropdown = () => setOpen(!open)

    React.useEffect(() => {
        if (!projectId) return;

        const fetchAnnotations = async () => {
            try {
                const response = await axiosClient.get(`/annotations/${projectId}/annotate`);
                const data = response.data.annotations || [];
                setAnnotations(data);

                const firstUnannotatedIndex = data.findIndex(a => !a.content);
                if (firstUnannotatedIndex !== -1) {
                    setCurrentIndex(firstUnannotatedIndex);
                } else {
                    setCurrentIndex(0);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des annotations :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnotations();
    }, [projectId]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    React.useEffect(() => {
        if (annotations.length > 0) {
            const current = annotations[currentIndex];
            setSelectedCategory(current.content || "");
        }
    }, [currentIndex, annotations])

    if (loading) return <Loading />;

    // On filtre les annotations qui ont bien un texte
    const sentences = annotations.map(a => a.text || "");

    const nextSentence = () => {
        if (currentIndex < sentences.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSentence = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex -1);
        }
    };

    // Message s'il n'y a aucune phrase à annoter
    const currentSentence = sentences.length > 0 ? sentences[currentIndex] : "Acune phrase à annoter";

    // Fonction pour envoyer l'annotation au backend
    const handleSubmit = async () => {
        if (!selectedCategory) return;
        try {
            const payload = {
                annotationId: annotations[currentIndex].id,
                category: selectedCategory,
                date: new Date().toISOString()
            };
            await axiosClient.post(`/annotations/${projectId}/submit`, payload);

            // Mettre à jour l'état local:
            setAnnotations(prev => {
                const newArr = [...prev];
                newArr[currentIndex] = {
                    ...newArr[currentIndex],
                    content: selectedCategory,
                    date : new Date().toISOString()
                };
                return newArr;
            })

            alert("Annotations soumise avec succès");
            nextSentence(); // passe automatiquement à la phrase suivante
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'annotation :", error);
            alert("Erreur lors de l'envoi de l'annotation.");
        }
    }

    return (
        <div className="annotate-container">
            <div className="annotate-subtitle">
                Annoter les textes
            </div>

            <div className="text-container">
                {currentSentence}
            </div>

            {sentences.length > 0 && (
                <div className="nav-buttons">
                    <button
                        onClick={prevSentence}
                        disabled={currentIndex === 0}
                        className="arrow-btn"
                    >
                        ←
                    </button>

                    <span className="counter">
                        {currentIndex +1} / {sentences.length}
                    </span>

                    <button 
                        onClick={nextSentence}
                        disabled={currentIndex === sentences.length -1}
                        className="arrow-btn"
                    >
                        →
                    </button>
                </div>
            )}

            {/* Dropdown des différentes catégories */}
            <div className="dropdown" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="dropdown-btn">
                    Catégorie ▾
                </button>

                {open && (
                    <div className="dropdown-menu">
                        {projectCategories && projectCategories.length > 0 ? (
                            projectCategories.map((category, idx) => (
                                <button key={idx} 
                                    className="dropdown-item"
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setOpen(false);
                                    }}>
                                        {category}
                                </button>
                            ))
                        ) : (
                            <span className="dropdown-item">
                                Aucune catégorie
                            </span>
                        )}
                    </div>
                )}

                {/* Faire apparaître un bouton submit */}

                {selectedCategory && (
                    <div className="selected-category-container">
                        <div className="selected-category">
                            {selectedCategory}
                        </div>
                        <button 
                            className="annotation-submit" 
                            onClick={handleSubmit}
                        >
                            Valider
                        </button>
                    </div>
                )}

            </div>

        </div>
    )
}