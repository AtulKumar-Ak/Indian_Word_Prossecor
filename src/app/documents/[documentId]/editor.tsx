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
import { Extension } from "@tiptap/core"

// --- CUSTOM FONT SIZE EXTENSION ---
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

// --- NEW: CUSTOM BACKSPACE TABLE DELETION ---
// This listens for Backspace. If you are at the very start of the first cell, it deletes the table.
const TableDeleteHelper = Extension.create({
  name: 'tableDeleteHelper',
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        
        // If the user has highlighted text, let standard backspace handle it
        if (!selection.empty) return false;

        // Check if we are inside a table
        if (editor.isActive('table')) {
          const { $anchor } = selection;
          let tableDepth = -1;
          
          // Find the exact depth of the table node in the document tree
          for (let d = $anchor.depth; d > 0; d--) {
            if ($anchor.node(d).type.name === 'table') {
              tableDepth = d;
              break;
            }
          }

          if (tableDepth !== -1) {
            // Check our exact position: Row index, Column index, and Text block index
            const rowIndex = $anchor.index(tableDepth);
            const colIndex = $anchor.index(tableDepth + 1);
            const blockIndex = $anchor.index(tableDepth + 2);

            // If we are in Row 0, Col 0, Block 0, and cursor is at the very front (Offset 0)
            if (rowIndex === 0 && colIndex === 0 && blockIndex === 0 && $anchor.parentOffset === 0) {
              editor.chain().focus().deleteTable().run();
              return true; // Successfully deleted the table, stop default backspace
            }
          }
        }
        return false;
      }
    };
  },
});

interface EditorProps {
  initialContent?: string;
}

export const Editor = ({ initialContent }: EditorProps) => {
  const { setEditor } = useEditorStore()
  
  let parsedContent;
  if (initialContent) {
    try {
      parsedContent = JSON.parse(initialContent);
    } catch (e) {
      console.error("Failed to parse initial content", e);
    }
  }

  const liveblocks = useLiveblocksExtension({
    initialContent: parsedContent || { type: "doc", content: [{ type: "paragraph" }] }
  })
  
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
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TextStyle,
      FontFamily,
      FontSize,
      TableDeleteHelper, // <-- NEW EXTENSION ADDED HERE
      Underline,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      IndicTransliteration.configure({ defaultLanguage: "hi" }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
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