import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {TextStyle} from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { CiTextAlignCenter, CiTextAlignRight, CiTextAlignJustify, CiTextAlignLeft } from "react-icons/ci";
import { AiOutlineUnorderedList, AiOutlineOrderedList, AiOutlineBold, AiOutlineItalic, AiOutlineUnderline } from "react-icons/ai";
import './RichTextEditor.css'

export default function RichTextEditor({ value = '', onChange }) {
    const [focused, setFocused] = useState(false)
    const editor = useEditor({
        extensions: [
        StarterKit,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Underline,
        TextStyle,
        Color,
        ],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    })

    if (!editor) return <div>Chargement de l'éditeur…</div>

    const applyAlign = (align) => {
        if (!editor) return
        editor.chain().focus().setTextAlign(align).run()
    }


    const colors = [
        { name: 'Noir', color: '#000000' },
        { name: 'Rouge', color: '#ef4444' },
        { name: 'Vert', color: '#10b981' },
        { name: 'Bleu', color: '#3b82f6' },
        { name: 'Orange', color: '#f97316' },
        ]

    return (
        <div className="editor-container">
            <div className="toolbar-container">
            <div className="toolbar" role="toolbar" aria-label="Outils de mise en page">

                {/* Alignement */}
                <button 
                type="button" 
                onClick={() => applyAlign('left')}
                className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
                >
                <CiTextAlignLeft size={20} />
                </button>
                <button 
                type="button" 
                onClick={() => applyAlign('center')}
                className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
                >
                <CiTextAlignCenter size={20} />
                </button>
                <button 
                type="button" 
                onClick={() => applyAlign('right')}
                className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
                >
                <CiTextAlignRight size={20} />
                </button>
                <button 
                type="button" 
                onClick={() => applyAlign('justify')}
                className={editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}
                >
                <CiTextAlignJustify size={20} />
                </button>

                {/* Listes */}
                <button type="button" 
                onClick={() => editor.chain().focus().toggleBulletList().run()} 
                className={editor.isActive('bulletList') ? 'active' : ''}>
                    <AiOutlineUnorderedList size={20} />
                </button>
                <button type="button" 
                onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                className={editor.isActive('orderedList') ? 'active' : ''}>
                    <AiOutlineOrderedList size={20} />
                </button>

                {/* Styles de texte */}
                <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'active' : ''}
                >
                    <AiOutlineBold size={20} />
                </button>

                <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'active' : ''}
                >
                    <AiOutlineItalic size={20} />
                </button>

                <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'active' : ''}
                >
                    <AiOutlineUnderline size={20} />
                </button>

            </div>

            <div className="toolbar-colors">
                {colors.map(c => (
                    <button
                    key={c.color}
                    type="button"
                    onClick={() => editor.chain().focus().setColor(c.color).run()}
                    style={{
                        backgroundColor: c.color,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: editor.isActive({ color: c.color }) ? '2px solid #3b82f6' : '1px solid #ccc',
                        cursor: 'pointer',
                    }}
                    title={c.name}
                    />
                ))}
                </div>
            </div>

            <EditorContent 
            editor={editor}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="tiptap-editor" />
            
        </div>
    )
}