// src/components/TestTipTap.js
import React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const TestTipTap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Bienvenue sur Labelia ✨</p>",
  })

  if (!editor) return <p>Chargement de l’éditeur...</p> // 🔹 évite écran vide

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
      <EditorContent editor={editor} />
    </div>
  )
}

export default TestTipTap