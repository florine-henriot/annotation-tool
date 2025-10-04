import React from "react";
import "./Annotate.css";
import axiosClient from "../api/axiosClient";


/**
 * Annotate
 * 
 * Composant d'annotation des phrases d'un projet.
 * 
 * Ce composant permet à l'utilisateur d'annoter une série de phrases : 
 * - Une phrase à la fois d'affichée
 * - l'utilisateur peut naviguer entre les phrases
 * - l'utilisateur peut sélectionner une catégorie et envoyer son annotation
 * - les annotations sont sauvegardées dans la base de données
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number|string} props.projectId - Identifiant du projet d'annotation
 * @param {string[]} props.projectCategories - Liste des catégories d'annotation
 * @param {Object[]} props.annotations - Liste des phrases à annoter
 * @param {Function} pops.setAnnotations - Fonction qui met à jour la liste des annotations
 * @param {number} props.currentIndex - Index de la phrase affichée
 * @param {Function} props.setCurrentIndex - Fonction pour changer la phrase affichée.
 * 
 * @example
 * <Annotate 
 *    projectId = {12}
 *    projectCategories = {["Positif", "Négatif", "Neutre"]}
 *    annotations = {[
 *        {id: 1, text: "J'aime ce produit.", content: "", date: null},
 *        {id: 2, text: "Je n'aime pas ce produit", content: "", date: null}
 *    ]}
 *    setAnnotations={setAnnotations}
 *    currentIndex={0}
 *    setCurrentIndex={setCurrentIndex}
 * />
 * 
 * @returns {JSX.Element} Interface interactive pour annoter les phrases du projet.
 */
export default function Annotate({
  projectId,
  projectCategories,
  annotations,
  setAnnotations,
  currentIndex,
  setCurrentIndex
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const dropdownRef = React.useRef(null);

  /**
   * Met à jour la catégorie lorsqu'on change d'index.
   */
  React.useEffect(() => {
    if (annotations.length > 0) {
      const current = annotations[currentIndex];
      setSelectedCategory(current?.content || "");
    }
  }, [currentIndex, annotations]);

  /**
   * Ouvre ou ferme le menu déroulant
   * @returns 
   */
  const toggleDropdown = () => setOpen(!open);

  /**
   * Pass à la phrase suivante
   */
  const nextSentence = () => {
    if (currentIndex < annotations.length - 1) setCurrentIndex(currentIndex + 1);
  };

  /**
   * Revient à la phrase précédente
   */
  const prevSentence = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  /**
   * Envoie l'annotation au backend. Met aussi à jour localement la phrase annotée.
   * En cas d'erreur, affiche une alerte utilisateur.
   * @returns 
   */
  const handleSubmit = async () => {
    if (!selectedCategory) return;

    try {
      const payload = {
        annotationId: annotations[currentIndex].id,
        category: selectedCategory,
        date: new Date().toISOString()
      };
      await axiosClient.post(`/annotations/${projectId}/submit`, payload);

      // Mise à jour locale de l'annotation
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