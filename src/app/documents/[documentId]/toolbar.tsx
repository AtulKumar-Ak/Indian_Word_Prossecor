"use client"
import { ZoomIn, ZoomOut } from "lucide-react";
import { useState, useCallback, useRef,useEffect } from "react"
import { useEditorStore } from "@/store/use-editor-store"
import { useLanguageStore } from "@/store/use-language-store"
import {
  Undo2Icon,
  Redo2Icon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Mic,
  Volume2Icon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  TableIcon,
  ImageIcon,
  SaveIcon,
  FolderOpenIcon,
  PrinterIcon,
  TypeIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  IndentIcon,
  OutdentIcon,
  HighlighterIcon,
  Link2Icon,
  SubscriptIcon,
  SuperscriptIcon,
  RemoveFormattingIcon,
  FileTextIcon,
  DownloadIcon,
  FilePlusIcon,
  CheckSquareIcon,
  MinusIcon,
  SearchIcon,
  CopyIcon,
  ScissorsIcon,
  ClipboardIcon,
  Languages,
  PresentationIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { translations } from "@/lib/translations"
import { translateText } from "@/lib/translate"

const FONT_SIZES = ["10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"]

const TEXT_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff",
  "#4a86e8", "#0000ff", "#9900ff", "#ff00ff", "#e6b8af", "#f4cccc",
]

const HIGHLIGHT_COLORS = [
  "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff0000", "#0000ff",
  "#ffa500", "#800080", "#ffc0cb", "#90ee90", "#add8e6", "#ffb6c1",
]

export const Toolbar = () => {
 const {
  editor,
  zoom,
  setZoom,
  isLandscape,
  toggleOrientation,
  isPresentationMode,
  togglePresentationMode
} = useEditorStore();
  const { language, supportedLanguages, setLanguage } = useLanguageStore()
  const [activeTab, setActiveTab] = useState("home")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [isTranslating, setIsTranslating] = useState(false);
  // 2. Create a reference to hold the recognition object
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const indianFonts = [
    { label: "Hindi (Mangal)", value: "Mangal" },
    { label: "Hindi (Devanagari)", value: "Noto Sans Devanagari" },
    { label: "Tamil (Lohit)", value: "Lohit Tamil" },
    { label: "Bengali (Lohit)", value: "Lohit Bengali" },
    { label: "Telugu (Gautami)", value: "Gautami" },
    { label: "Marathi (Sanskrit)", value: "Noto Serif Devanagari" },
    { label: "Gujarati (Shruti)", value: "Shruti" },
    { label: "Kannada (Tunga)", value: "Tunga" },
    { label: "Malayalam (Kartika)", value: "Kartika" },
    { label: "Punjabi (Raavi)", value: "Raavi" },
    { label: "English (Arial)", value: "Arial" },
    { label: "English (Times)", value: "Times New Roman" },
  ]

const handleVoiceTyping = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported.")
      return
    }

    // 3. TOGGLE LOGIC: If it's already listening, stop the EXISTING instance
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // 4. START LOGIC: Create the instance and store it in the ref
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition; // Save it here!

    recognition.lang = language.code
    recognition.continuous = true; 
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true)
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("")

      if (event.results[event.results.length - 1].isFinal && editor) {
        editor.chain().focus().insertContent(transcript + " ").run()
      }
    }

    recognition.onerror = (event: any) => {
      console.error(event.error)
      setIsListening(false)
    }

    // Reset UI if the recognition ends naturally (e.g., silence)
    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null;
    }

    recognition.start()
  }, [editor, isListening, language])

const handleTranslate = useCallback(async () => {
  // Check if editor exists and we aren't already busy
  if (!editor || isTranslating) return;

  // 1. Get selection (Faster: translating 10 words is instant vs 1000 words)
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to, " ");
  
  // 2. Fallback to whole document if nothing is selected
  const textToTranslate = selectedText || editor.getText();
  
  if (!textToTranslate || textToTranslate.trim().length === 0) return;

  setIsTranslating(true);

  try {
    const translatedText = await translateText(textToTranslate, 'en', language.code);
    
    if (selectedText) {
      // Replace only what was selected
      editor.chain().focus().insertContent(translatedText).run();
    } else {
      // Replace everything
      editor.chain().focus().setContent(translatedText).run();
    }
  } catch (error) {
    console.error("Translation failed", error);
    alert("Service busy. Please try again in a moment.");
  } finally {
    setIsTranslating(false);
  }
  // Remove isTranslating from here to stop the ESLint warning 
  // and prevent unnecessary function re-creations.
}, [editor, language.code]);

  const handleReadAloud = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.")
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const text = editor?.getText() || ""
    if (text) {
      const ut = new SpeechSynthesisUtterance(text)
      ut.lang = language.code
      ut.onend = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(ut)
    }
  }, [editor, isSpeaking, language])

  const handlePrint = useCallback(() => {
    const content = editor?.getHTML()
    const printWindow = window.open("", "", "width=800,height=600")
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document</title>
            <style>
              body { font-family: 'Mangal', 'Noto Sans Devanagari', sans-serif; padding: 40px; line-height: 1.6; }
              table { border-collapse: collapse; width: 100%; }
              td, th { border: 1px solid #ccc; padding: 8px; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [editor])

  const handleDownload = useCallback(() => {
    const content = editor?.getHTML() || ""
    const blob = new Blob(
      [
        `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
          <style>
            body { font-family: 'Mangal', 'Noto Sans Devanagari', sans-serif; padding: 40px; line-height: 1.6; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ccc; padding: 8px; }
          </style>
        </head>
        <body>${content}</body>
      </html>`,
      ],
      { type: "text/html" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.html"
    a.click()
    URL.revokeObjectURL(url)
  }, [editor])

  const handleSearch = useCallback(() => {
    if (!searchText || !editor) return
    const { state } = editor
    const { doc } = state
    let found = false

    doc.descendants((node, pos) => {
      if (found) return false
      if (node.isText && node.text?.toLowerCase().includes(searchText.toLowerCase())) {
        const index = node.text.toLowerCase().indexOf(searchText.toLowerCase())
        editor.chain().focus().setTextSelection({ from: pos + index, to: pos + index + searchText.length }).run()
        found = true
        return false
      }
    })

    if (!found) {
      alert("Text not found / टेक्स्ट नहीं मिला")
    }
  }, [editor, searchText])

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor?.chain().focus().unsetLink().run()
      return
    }
    editor?.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl("")
  }, [editor, linkUrl])

  if (!editor) return null

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    active = false,
    tooltip,
    disabled = false,
  }: {
    icon: any
    onClick: () => void
    active?: boolean
    tooltip: string
    disabled?: boolean
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "p-1.5 rounded transition-colors disabled:opacity-50",
              active
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            )}
          >
            <Icon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="flex flex-col bg-background border-b border-border shadow-sm transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-card text-foreground transition-colors">
        <div className="flex items-center whitespace-nowrap">
          <img
            src="/logo.png"
            alt="Bharat Docs Logo"
            className="h-10 w-12 "
          />
          <span className=" font-bold text-lg text-[#F69836]">Bharat</span>
          <span className="text-lg text-[#2F87C7]">Docs</span>
        </div>

      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-x-1 px-2 pt-1 bg-muted transition-colors">
        {["file", "home", "insert", "view"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 text-sm rounded-t-md transition capitalize",
             activeTab === tab
               ? "bg-card font-semibold text-foreground border-x border-t border-border"
               : "hover:bg-muted text-muted-foreground"
            )}
          >
            {`${translations[tab]['en']} / ${translations[tab][language.code]}`}
          </button>
        ))}
      </div>

      {/* Toolbar Content */}
      <div className="flex items-center gap-x-1.5 px-3 py-2 bg-card border-t border-border flex-wrap transition-colors">
        {/* FILE TAB */}
        {activeTab === "file" && (
          <>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().clearContent().run()
                editor.chain().focus().setContent("<p></p>").run()
              }}
              className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"
            >
              <FilePlusIcon className="size-4" /> New / नया
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"
            >
              <FolderOpenIcon className="size-4" /> Open / खोलें
            </button>
            <button
              type="button"
              onClick={handleDownload}
             className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"            >
              <SaveIcon className="size-4" /> Save / सहेजें
            </button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <button
              type="button"
              onClick={handlePrint}
             className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"
            >
              <PrinterIcon className="size-4" /> Print / प्रिंट
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"
            >
              <DownloadIcon className="size-4" /> Download / डाउनलोड
            </button>
          </>
        )}

        {/* HOME TAB */}
        {activeTab === "home" && (
          <>
            {/* Undo/Redo */}
            <ToolbarButton icon={Undo2Icon} onClick={() => editor.chain().focus().undo().run()} tooltip="Undo / पूर्ववत" disabled={!editor.can().undo()} />
            <ToolbarButton icon={Redo2Icon} onClick={() => editor.chain().focus().redo().run()} tooltip="Redo / फिर से" disabled={!editor.can().redo()} />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton
              icon={PresentationIcon}
              onClick={togglePresentationMode}
              tooltip="Preview / पूर्वावलोकन"
            />

            {/* Clipboard */}
            <ToolbarButton icon={ScissorsIcon} onClick={() => document.execCommand("cut")} tooltip="Cut / काटें" />
            <ToolbarButton icon={CopyIcon} onClick={() => document.execCommand("copy")} tooltip="Copy / कॉपी" />
            <ToolbarButton icon={ClipboardIcon} onClick={() => document.execCommand("paste")} tooltip="Paste / चिपकाएं" />
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Font Selection */}
            <select
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            className="bg-card border border-border text-xs p-1.5 rounded text-foreground focus:outline-none"
              value={editor.getAttributes("textStyle").fontFamily || "Mangal"}
            >
              {indianFonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            {/* Language Selection for Transliteration */}
            <select
              onChange={(e) => {
                const selectedLang = supportedLanguages.find(lang => lang.code === e.target.value);
                if (selectedLang) {
                  setLanguage(selectedLang);
                }
              }}
             className="bg-card border border-border text-xs p-1.5 rounded text-foreground focus:outline-none"
              value={language.code}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            {/* Translate Button */}
            <ToolbarButton icon={Languages} onClick={handleTranslate} tooltip="Translate / अनुवाद" />

            {/* Font Size */}
            <select
              onChange={(e) => {
                const size = e.target.value
                editor.chain().focus().setMark("textStyle", { fontSize: `${size}px` }).run()
              }}
              className="bg-card border border-border text-xs p-1.5 rounded w-[65px] font-medium text-foreground focus:outline-none"
              defaultValue="14"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text Color */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="p-1.5 rounded hover:bg-muted transition-colors">
                  <TypeIcon className="size-4" />
                  <div
                    className="absolute bottom-0.5 left-1 right-1 h-1 rounded-full"
                    style={{ backgroundColor: editor.getAttributes("textStyle").color || "#000" }}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <p className="text-xs font-medium mb-2">Text Color / टेक्स्ट रंग</p>
                <div className="grid grid-cols-6 gap-1">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border hover:scale-110 transition"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setColor(color).run()}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Highlight Color */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="p-1.5 rounded hover:bg-muted transition-colors">
                  <HighlighterIcon className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <p className="text-xs font-medium mb-2">Highlight / हाइलाइट</p>
                <div className="grid grid-cols-6 gap-1">
                  {HIGHLIGHT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border hover:scale-110 transition"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text Formatting */}
            <ToolbarButton icon={BoldIcon} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} tooltip="Bold / बोल्ड (Ctrl+B)" />
            <ToolbarButton icon={ItalicIcon} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} tooltip="Italic / इटैलिक (Ctrl+I)" />
            <ToolbarButton icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} tooltip="Underline / रेखांकन (Ctrl+U)" />
            <ToolbarButton icon={StrikethroughIcon} onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} tooltip="Strikethrough / स्ट्राइकथ्रू" />
            <ToolbarButton icon={SubscriptIcon} onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} tooltip="Subscript / सबस्क्रिप्ट" />
            <ToolbarButton icon={SuperscriptIcon} onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} tooltip="Superscript / सुपरस्क्रिप्ट" />
            <ToolbarButton icon={RemoveFormattingIcon} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} tooltip="Clear Formatting / फॉर्मेटिंग हटाएं" />
            <Separator orientation="vertical" className="h-6 mx-1" />

           {/* Dynamic Alignment */}
<Popover>
  <PopoverTrigger asChild>
    <button
      type="button"
      className="p-1.5 rounded hover:bg-muted text-foreground transition"
    >
      {editor.isActive({ textAlign: "center" }) ? (
        <AlignCenterIcon className="size-4" />
      ) : editor.isActive({ textAlign: "right" }) ? (
        <AlignRightIcon className="size-4" />
      ) : editor.isActive({ textAlign: "justify" }) ? (
        <AlignJustifyIcon className="size-4" />
      ) : (
        <AlignLeftIcon className="size-4" />
      )}
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-40 p-2 bg-card border border-border">
    <div className="flex flex-col gap-1">

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-muted text-sm",
          editor.isActive({ textAlign: "left" }) && "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          <AlignLeftIcon className="size-4" />
          Left
        </div>
        {editor.isActive({ textAlign: "left" }) && "✓"}
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-muted text-sm",
          editor.isActive({ textAlign: "center" }) && "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          <AlignCenterIcon className="size-4" />
          Center
        </div>
        {editor.isActive({ textAlign: "center" }) && "✓"}
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-muted text-sm",
          editor.isActive({ textAlign: "right" }) && "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          <AlignRightIcon className="size-4" />
          Right
        </div>
        {editor.isActive({ textAlign: "right" }) && "✓"}
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-muted text-sm",
          editor.isActive({ textAlign: "justify" }) && "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          <AlignJustifyIcon className="size-4" />
          Justify
        </div>
        {editor.isActive({ textAlign: "justify" }) && "✓"}
      </button>

    </div>
  </PopoverContent>
</Popover>

<Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists & Indentation */}
<Popover>
  <PopoverTrigger asChild>
    <button
      type="button"
      className="p-1.5 rounded hover:bg-muted text-foreground transition"
    >
      {editor.isActive("orderedList") ? (
        <ListOrderedIcon className="size-4" />
      ) : editor.isActive("taskList") ? (
        <CheckSquareIcon className="size-4" />
      ) : editor.isActive("bulletList") ? (
        <ListIcon className="size-4" />
      ) : (
        <ListIcon className="size-4" />
      )}
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-48 p-2 bg-card border border-border">
    <div className="flex flex-col gap-1">

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-muted text-sm",
          editor.isActive("bulletList") && "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          <ListIcon className="size-4" />
          Bullet List
        </div>
        {editor.isActive("bulletList") && "✓"}
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-muted text-sm",
          editor.isActive("orderedList") && "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          <ListOrderedIcon className="size-4" />
          Numbered List
        </div>
        {editor.isActive("orderedList") && "✓"}
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-muted text-sm",
          editor.isActive("taskList") && "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          <CheckSquareIcon className="size-4" />
          Task List
        </div>
        {editor.isActive("taskList") && "✓"}
      </button>

      <div className="border-t border-border my-1" />

      <button
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted text-sm"
      >
        <IndentIcon className="size-4" />
        Increase Indent
      </button>

      <button
        onClick={() => editor.chain().focus().liftListItem("listItem").run()}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted text-sm"
      >
        <OutdentIcon className="size-4" />
        Decrease Indent
      </button>

    </div>
  </PopoverContent>
</Popover>

<Separator orientation="vertical" className="h-6 mx-1" />

            {/* Voice Features */}
            <ToolbarButton
            icon={Mic}
            onClick={handleVoiceTyping}
            active={isListening}
            tooltip={isListening ? "Listening... / सुन रहा हूँ..." : "Voice Input / आवाज इनपुट"}
            // Optional: add a class to pulse if listening
            />
            <ToolbarButton
              icon={Volume2Icon}
              onClick={handleReadAloud}
              active={isSpeaking}
              tooltip="Read Aloud / पढ़कर सुनाएं"
            />
          </>
        )}

        {/* INSERT TAB */}
        {activeTab === "insert" && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
             className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"
            >
              <TableIcon className="size-4" /> Table / तालिका
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Enter Image URL / छवि URL दर्ज करें:")
                if (url) editor.chain().focus().setImage({ src: url }).run()
              }}
              className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"
            >
              <ImageIcon className="size-4" /> Picture / चित्र
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                 className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"
                >
                  <Link2Icon className="size-4" /> Link / लिंक
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3">
                <p className="text-xs font-medium mb-2">Insert Link / लिंक डालें</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button size="sm" onClick={setLink}>
                    Add
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
             className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors text-foreground"            >
              <MinusIcon className="size-4" /> Divider / विभाजक
            </button>
          </>
        )}

       {/* VIEW TAB */}
{activeTab === "view" && (
  <>
    {/* Search */}
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search text... / टेक्स्ट खोजें..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="text-xs w-48 h-8"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleSearch}
        className="h-8 bg-transparent"
      >
        <SearchIcon className="size-4 mr-1" />
        Find / खोजें
      </Button>
    </div>

    <Separator orientation="vertical" className="h-6 mx-2" />

    {/* Zoom Controls */}
    <div className="flex items-center gap-2">

      {/* Zoom Out */}
      <button
        onClick={() => setZoom(Math.max(50, zoom - 10))}
        className="p-1.5 rounded hover:bg-muted transition"
      >
        <ZoomOut className="size-4" />
      </button>

      {/* Zoom Display */}
      <button
        onClick={() => setZoom(100)}
        className="text-sm w-14 text-center font-medium hover:bg-muted rounded px-1 py-0.5 transition"
      >
        {zoom}%
      </button>

      {/* Zoom In */}
      <button
        onClick={() => setZoom(Math.min(200, zoom + 10))}
        className="p-1.5 rounded hover:bg-muted transition"
      >
        <ZoomIn className="size-4" />
      </button>
<Separator orientation="vertical" className="h-6 mx-2" />

{/* Orientation Toggle */}
<button
  onClick={toggleOrientation}
  className={cn(
    "px-3 py-1.5 text-xs rounded border transition",
    isLandscape
      ? "bg-primary text-primary-foreground"
      : "bg-card border-border hover:bg-muted text-foreground"
  )}
>
  {isLandscape ? "Landscape / क्षैतिज" : "Portrait / लंबवत"}
</button>
    </div>
  </>
)}

      </div>
    </div>
    
  )
}

