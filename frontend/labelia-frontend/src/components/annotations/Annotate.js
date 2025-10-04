import React from "react";
import "./Annotate.css";
import axiosClient from "../api/axiosClient";

export default function Annotate({
  projectId,
  projectCategories,
  annotations,
  setAnnotations,
  currentIndex,
  setCurrentIndex        // ✅ vient du parent
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    if (annotations.length > 0) {
      const current = annotations[currentIndex];
      setSelectedCategory(current?.content || "");
    }
  }, [currentIndex, annotations]);

  const toggleDropdown = () => setOpen(!open);
  const nextSentence = () => {
    if (currentIndex < annotations.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const prevSentence = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (!selectedCategory) return;

    try {
      const payload = {
        annotationId: annotations[currentIndex].id,
        category: selectedCategory,
        date: new Date().toISOString()
      };
      await axiosClient.post(`/annotations/${projectId}/submit`, payload);

      setAnnotations(prev => {
        const newArr = [...prev];
        newArr[currentIndex] = {
          ...newArr[currentIndex],
          content: selectedCategory,
          date: new Date().toISOString()
        };
        return newArr;
      });

      nextSentence();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'annotation :", error);
      alert("Erreur lors de l'envoi de l'annotation.");
    }
  };

  const currentSentence = annotations[currentIndex]?.text || "Aucune phrase à annoter";

  return (
    <div className="annotate-container">
      <div className="annotate-subtitle">Annoter les textes</div>

      <div className="text-container">{currentSentence}</div>

      {annotations.length > 0 && (
        <div className="nav-buttons">
          <button onClick={prevSentence} disabled={currentIndex === 0} className="arrow-btn">
            ←
          </button>
          <span className="counter">
            {currentIndex + 1} / {annotations.length}
          </span>
          <button
            onClick={nextSentence}
            disabled={currentIndex === annotations.length - 1}
            className="arrow-btn"
          >
            →
          </button>
        </div>
      )}

      <div className="dropdown" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="dropdown-btn">
          Catégorie ▾
        </button>

        {open && (
          <div className="dropdown-menu">
            {projectCategories?.map((category, idx) => (
              <button
                key={idx}
                className="dropdown-item"
                onClick={() => {
                  setSelectedCategory(category);
                  setOpen(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {selectedCategory && (
          <div className="selected-category-container">
            <div className="selected-category">{selectedCategory}</div>
            <button className="annotation-submit" onClick={handleSubmit}>
              Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}