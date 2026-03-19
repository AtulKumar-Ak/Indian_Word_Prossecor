"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEditorStore } from "@/store/use-editor-store"
import { IndicTransliteration } from "@/extensions/indic-transliteration"
import FontFamily from "@tiptap/extension-font-family"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Placeholder from "@tiptap/extension-placeholder"
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { Extension } from "@tiptap/core" // ADDED: Core extension utility

// --- CUSTOM FONT SIZE EXTENSION ---
// TipTap does not have a native font-size extension, so we must define how it reads and writes the CSS style.
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
})
// ----------------------------------

export const Editor = () => {
  const { setEditor } = useEditorStore()
  const liveblocks = useLiveblocksExtension()
  
  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor)
    },
    onDestroy() {
      setEditor(null)
    },
    onUpdate({ editor }) {
      setEditor(editor)
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none w-full h-full text-foreground prose prose-sm max-w-none",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      FontFamily,
      FontSize, // ADDED: Our custom FontSize extension
      Underline,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      IndicTransliteration.configure({
        defaultLanguage: "hi",
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Subscript,
      Superscript,
      Placeholder.configure({
        placeholder: "यहाँ टाइप करें... Start typing here...",
      }),
    ],
    immediatelyRender: false,
  })

  return (
    <div className="w-full h-full">
      <EditorContent editor={editor} />
    </div>
  )
}