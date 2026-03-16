"use client"
import { ZoomIn, ZoomOut } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react"
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
  PrinterIcon,
  TypeIcon,
  HighlighterIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  Languages,
  StrikethroughIcon,
  FilePlusIcon,
  DownloadIcon,
  ScissorsIcon,
  CopyIcon,
  ClipboardIcon,
  MousePointerSquareIcon,
  PresentationIcon,
  MinusIcon,
  RemoveFormattingIcon,
  InfoIcon,
  SubscriptIcon,
  SuperscriptIcon,
  CodeIcon,
  SquareCodeIcon,
  CheckSquareIcon,
  IndentIcon,
  OutdentIcon,
  SearchIcon,
  SparklesIcon // ADDED
} from "lucide-react"
import { cn } from "@/lib/utils"
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
import { translateText } from "@/lib/translate"
import { generateSpeech } from "@/lib/tts"

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

const menuTranslations = {
  File: { en: "File", hi: "फ़ाइल", bn: "ফাইল", ta: "கோப்பு", te: "ఫైల్", mr: "फाइल", gu: "ફાઇલ", kn: "ಫೈಲ್", ml: "ഫയൽ", pa: "ਫ਼ਾਈਲ" },
  Edit: { en: "Edit", hi: "संपादित करें", bn: "সম্পাদনা", ta: "தொகு", te: "సవరించు", mr: "संपादित करा", gu: "ફેરફાર કરો", kn: "ತಿದ್ದು", ml: "തിരുത്തുക", pa: "ਸੋਧੋ" },
  View: { en: "View", hi: "देखें", bn: "দেখুন", ta: "பார்வை", te: "వీక్షించండి", mr: "पहा", gu: "જુઓ", kn: "ವೀಕ್ಷಿಸಿ", ml: "കാണുക", pa: "ਵੇਖੋ" },
  Insert: { en: "Insert", hi: "डालें", bn: "ঢোকান", ta: "செருகு", te: "చొప్పించు", mr: "घाला", gu: "દાખલ કરો", kn: "ಸೇರಿಸು", ml: "തിരുകുക", pa: "ਸ਼ਾਮਲ ਕਰੋ" },
  Format: { en: "Format", hi: "प्रारूप", bn: "বিন্যাস", ta: "வடிவமைப்பு", te: "ఆకృతి", mr: "स्वरूप", gu: "ફોર્મેટ", kn: "ಸ್ವರೂಪ", ml: "ഫോർമാറ്റ്", pa: "ਫਾਰਮੈਟ" },
  Tools: { en: "Tools", hi: "उपकरण", bn: "সরঞ্জাম", ta: "கருவிகள்", te: "సాధనాలు", mr: "साधने", gu: "સાધनों", kn: "ಉಪಕರಣಗಳು", ml: "ഉപകരണങ്ങൾ", pa: "ਟੂਲ" },
  Help: { en: "Help", hi: "मदद", bn: "সাহায্য", ta: "உதவி", te: "సహాయం", mr: "मदत", gu: "મદદ", kn: "ಸಹಾಯ", ml: "സഹായം", pa: "ਮਦਦ" },
}

export const Toolbar = () => {
  const {
    editor,
    zoom,
    setZoom,
    togglePresentationMode,
    isAiSidebarOpen, // ADDED
    toggleAiSidebar  // ADDED
  } = useEditorStore();
  const { language, supportedLanguages, setLanguage } = useLanguageStore()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [searchText, setSearchText] = useState("") 
  const [isTranslating, setIsTranslating] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    return () => {
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

  // === Handlers ===
  const handleVoiceTyping = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { alert("Speech recognition is not supported."); return }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition;
    recognition.lang = language.code; recognition.continuous = true; recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true)
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).slice(event.resultIndex).map((result: any) => result[0]).map((result) => result.transcript).join("")
      if (event.results[event.results.length - 1].isFinal && editor) {
        editor.chain().focus().insertContent(transcript + " ").run()
      }
    }
    recognition.onerror = (event: any) => { console.error(event.error); setIsListening(false) }
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; }
    recognition.start()
  }, [editor, isListening, language])

  const handleTranslate = useCallback(async () => {
    if (!editor || isTranslating) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    const textToTranslate = selectedText || editor.getText();
    if (!textToTranslate || textToTranslate.trim().length === 0) return;

    setIsTranslating(true);
    try {
      const translatedText = await translateText(textToTranslate, 'auto', language.code);
      if (selectedText) editor.chain().focus().insertContent(translatedText).run();
      else editor.chain().focus().setContent(translatedText).run();
    } catch (error) {
      alert("Service busy. Please try again in a moment.");
    } finally {
      setIsTranslating(false);
    }
  }, [editor, language.code, isTranslating]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleReadAloud = useCallback(async () => {
    if (isSpeaking) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setIsSpeaking(false); return;
    }
    const text = editor?.getText() || "";
    if (!text) return;

    setIsSpeaking(true);
    try {
      const base64Audio = await generateSpeech(text, language.code);
      if (base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audioRef.current = audio;
        audio.onended = () => { setIsSpeaking(false); audioRef.current = null; };
        await audio.play();
      }
    } catch (error) { setIsSpeaking(false); }
  }, [editor, isSpeaking, language.code]);

  const handlePrint = useCallback(() => {
    const content = editor?.getHTML()
    const printWindow = window.open("", "", "width=800,height=600")
    if (printWindow && content) {
      printWindow.document.write(`<html><head><title>Document</title><style>body { font-family: sans-serif; padding: 40px; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ccc; padding: 8px; }</style></head><body>${content}</body></html>`)
      printWindow.document.close(); printWindow.print();
    }
  }, [editor])

  const handleDownload = useCallback(() => {
    const content = editor?.getHTML() || ""
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title><style>body { font-family: sans-serif; padding: 40px; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ccc; padding: 8px; }</style></head><body>${content}</body></html>`], { type: "text/html" })
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "document.html"; a.click(); URL.revokeObjectURL(url);
  }, [editor])

  const setLink = useCallback(() => {
    if (!linkUrl) { editor?.chain().focus().unsetLink().run(); return }
    editor?.chain().focus().setLink({ href: linkUrl }).run(); setLinkUrl("")
  }, [editor, linkUrl])

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
    if (!found) alert("Text not found / टेक्स्ट नहीं मिला")
  }, [editor, searchText])

  if (!editor) return null

  // === Helper Components ===
  const getMenuName = (baseName: string) => {
    const code = language.code;
    const trans = menuTranslations[baseName as keyof typeof menuTranslations]?.[code as keyof typeof menuTranslations[keyof typeof menuTranslations]] || baseName;
    return trans === baseName ? baseName : `${baseName} / ${trans}`;
  };

  const TopMenu = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-2.5 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors focus:outline-none focus:bg-muted">
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1 bg-popover border border-border shadow-lg flex flex-col gap-0.5 z-50">
        {children}
      </PopoverContent>
    </Popover>
  );

  const TopMenuItem = ({ icon: Icon, label, shortcut, onClick }: { icon?: any, label: string, shortcut?: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded text-left transition-colors">
      <div className="flex items-center gap-2">{Icon && <Icon className="size-4 text-muted-foreground" />}<span>{label}</span></div>
      {shortcut && <span className="text-xs text-muted-foreground ml-4">{shortcut}</span>}
    </button>
  );

  const MenuDivider = () => <div className="h-[1px] bg-border my-1 w-full" />;

  const ToolbarButton = ({ icon: Icon, onClick, active = false, tooltip, disabled = false }: { icon: any, onClick: () => void, active?: boolean, tooltip: string, disabled?: boolean }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={onClick} disabled={disabled} className={cn("p-1.5 rounded transition-colors disabled:opacity-50 flex items-center justify-center", active ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground")}>
          <Icon className="size-[18px]" strokeWidth={2} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs font-medium bg-popover text-popover-foreground border-border">{tooltip}</TooltipContent>
    </Tooltip>
  )

  const Divider = () => <div className="w-[1px] h-5 bg-border mx-1" />;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col bg-background w-full">
        
        {/* Top Menu Row */}
        <div className="flex items-center px-4 py-2 border-b border-border relative z-50 bg-background">
          <div className="flex items-center whitespace-nowrap mr-4">
            <img src="/logo.png" alt="Bharat Docs Logo" className="h-8 w-10 mr-2" />
            <span className="font-bold text-lg text-[#F69836]">Bharat</span>
            <span className="text-lg text-[#2F87C7]">Docs</span>
          </div>
          
          <div className="flex flex-col justify-center">
            <Input type="text" defaultValue="Untitled Document" className="h-6 w-fit bg-transparent text-foreground border-transparent hover:border-border focus:border-blue-500 px-1 py-0 shadow-none text-sm font-medium focus-visible:ring-0" />
            
            <div className="flex items-center gap-1 mt-0.5">
               <TopMenu label={getMenuName("File")}>
                 <TopMenuItem icon={FilePlusIcon} label="New" onClick={() => editor.chain().focus().clearContent().setContent("<p></p>").run()} />
                 <TopMenuItem icon={DownloadIcon} label="Save / Download" onClick={handleDownload} />
                 <MenuDivider />
                 <TopMenuItem icon={PrinterIcon} label="Print" shortcut="Ctrl+P" onClick={handlePrint} />
               </TopMenu>

               <TopMenu label={getMenuName("Edit")}>
                 <TopMenuItem icon={Undo2Icon} label="Undo" shortcut="Ctrl+Z" onClick={() => editor.chain().focus().undo().run()} />
                 <TopMenuItem icon={Redo2Icon} label="Redo" shortcut="Ctrl+Y" onClick={() => editor.chain().focus().redo().run()} />
                 <MenuDivider />
                 <TopMenuItem icon={ScissorsIcon} label="Cut" shortcut="Ctrl+X" onClick={() => document.execCommand("cut")} />
                 <TopMenuItem icon={CopyIcon} label="Copy" shortcut="Ctrl+C" onClick={() => document.execCommand("copy")} />
                 <TopMenuItem icon={ClipboardIcon} label="Paste" shortcut="Ctrl+V" onClick={() => document.execCommand("paste")} />
                 <MenuDivider />
                 <TopMenuItem icon={MousePointerSquareIcon} label="Select All" shortcut="Ctrl+A" onClick={() => editor.chain().focus().selectAll().run()} />
               </TopMenu>

               <TopMenu label={getMenuName("View")}>
                 <TopMenuItem icon={ZoomIn} label="Zoom In" onClick={() => setZoom(Math.min(200, zoom + 10))} />
                 <TopMenuItem icon={ZoomOut} label="Zoom Out" onClick={() => setZoom(Math.max(50, zoom - 10))} />
                 <TopMenuItem label="100% Zoom" onClick={() => setZoom(100)} />
                 <MenuDivider />
                 <TopMenuItem icon={PresentationIcon} label="Full Screen (Preview)" onClick={togglePresentationMode} />
               </TopMenu>

               <TopMenu label={getMenuName("Insert")}>
                 <TopMenuItem icon={ImageIcon} label="Image" onClick={() => {
                   const url = window.prompt("Enter Image URL:")
                   if (url) editor.chain().focus().setImage({ src: url }).run()
                 }} />
                 <TopMenuItem icon={TableIcon} label="Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
                 <TopMenuItem icon={Link2Icon} label="Link" shortcut="Ctrl+K" onClick={() => {
                   const url = window.prompt("Enter URL:")
                   if (url) editor.chain().focus().setLink({ href: url }).run()
                 }} />
                 <MenuDivider />
                 <TopMenuItem icon={MinusIcon} label="Horizontal Line" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
               </TopMenu>

               <TopMenu label={getMenuName("Format")}>
                 <TopMenuItem icon={BoldIcon} label="Bold" shortcut="Ctrl+B" onClick={() => editor.chain().focus().toggleBold().run()} />
                 <TopMenuItem icon={ItalicIcon} label="Italic" shortcut="Ctrl+I" onClick={() => editor.chain().focus().toggleItalic().run()} />
                 <TopMenuItem icon={UnderlineIcon} label="Underline" shortcut="Ctrl+U" onClick={() => editor.chain().focus().toggleUnderline().run()} />
                 <TopMenuItem icon={StrikethroughIcon} label="Strikethrough" shortcut="Alt+Shift+5" onClick={() => editor.chain().focus().toggleStrike().run()} />
                 <MenuDivider />
                 <TopMenuItem icon={AlignLeftIcon} label="Align Left" shortcut="Ctrl+Shift+L" onClick={() => editor.chain().focus().setTextAlign("left").run()} />
                 <TopMenuItem icon={AlignCenterIcon} label="Align Center" shortcut="Ctrl+Shift+E" onClick={() => editor.chain().focus().setTextAlign("center").run()} />
                 <TopMenuItem icon={AlignRightIcon} label="Align Right" shortcut="Ctrl+Shift+R" onClick={() => editor.chain().focus().setTextAlign("right").run()} />
                 <MenuDivider />
                 <TopMenuItem icon={RemoveFormattingIcon} label="Clear Formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} />
               </TopMenu>

               <TopMenu label={getMenuName("Tools")}>
                 <TopMenuItem icon={Languages} label="Translate Document" onClick={handleTranslate} />
                 <TopMenuItem icon={Mic} label="Voice Typing" onClick={handleVoiceTyping} />
                 <TopMenuItem icon={Volume2Icon} label="Read Aloud" onClick={handleReadAloud} />
               </TopMenu>

               <TopMenu label={getMenuName("Help")}>
                 <TopMenuItem icon={InfoIcon} label="About BharatDocs" onClick={() => alert("BharatDocs - Rich Text Editor")} />
               </TopMenu>
            </div>
          </div>
          
          <div className="flex-grow" /> {/* ADDED: Pushes the AI button to the right */}

          <div className="flex items-center gap-3"> {/* ADDED: AI Button Container */}
             <Button
               size="sm"
               onClick={toggleAiSidebar}
               variant={isAiSidebarOpen ? "secondary" : "default"}
               className={cn("h-8 gap-2 px-4 rounded-full transition-colors", !isAiSidebarOpen && "bg-blue-600 hover:bg-blue-700 text-white")}
             >
               <SparklesIcon className="size-4" />
               {isAiSidebarOpen ? "Close AI" : "Ask AI"}
             </Button>
          </div>
          
        </div>

        {/* Main Action Toolbar */}
        <div className="flex items-center flex-wrap gap-y-2 px-4 py-1.5 bg-card border-b border-border shadow-sm relative z-40">
          
          <ToolbarButton icon={Undo2Icon} onClick={() => editor.chain().focus().undo().run()} tooltip="Undo (Ctrl+Z)" disabled={!editor.can().undo()} />
          <ToolbarButton icon={Redo2Icon} onClick={() => editor.chain().focus().redo().run()} tooltip="Redo (Ctrl+Y)" disabled={!editor.can().redo()} />
          <ToolbarButton icon={PrinterIcon} onClick={handlePrint} tooltip="Print (Ctrl+P)" />
          
          <Divider />

          {/* Fonts */}
          <Tooltip>
            <TooltipTrigger asChild>
              <select onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} className="bg-transparent hover:bg-muted border border-transparent hover:border-border text-xs px-2 py-1.5 rounded text-foreground focus:outline-none cursor-pointer" value={editor.getAttributes("textStyle").fontFamily || "Mangal"}>
                {indianFonts.map((font) => (<option key={font.value} value={font.value} className="bg-background text-foreground">{font.label}</option>))}
              </select>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Font</TooltipContent>
          </Tooltip>

          <Divider />

          <Tooltip>
            <TooltipTrigger asChild>
              <select onChange={(e) => { const size = e.target.value; editor.chain().focus().setMark("textStyle", { fontSize: `${size}px` }).run() }} className="bg-transparent hover:bg-muted border border-transparent hover:border-border text-xs px-2 py-1.5 rounded w-[60px] font-medium text-foreground focus:outline-none cursor-pointer" defaultValue="14">
                {FONT_SIZES.map((size) => (<option key={size} value={size} className="bg-background text-foreground">{size}</option>))}
              </select>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Font Size</TooltipContent>
          </Tooltip>
          
          <Divider />

          {/* Standard Formats */}
          <ToolbarButton icon={BoldIcon} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} tooltip="Bold (Ctrl+B)" />
          <ToolbarButton icon={ItalicIcon} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} tooltip="Italic (Ctrl+I)" />
          <ToolbarButton icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} tooltip="Underline (Ctrl+U)" />
          
          {/* NEW: Math & Technical Formats */}
          <ToolbarButton icon={SubscriptIcon} onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} tooltip="Subscript (Ctrl+,)" />
          <ToolbarButton icon={SuperscriptIcon} onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} tooltip="Superscript (Ctrl+.)" />
          <ToolbarButton icon={CodeIcon} onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} tooltip="Inline Code (Ctrl+E)" />

          <Divider />

          {/* Colors */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild><div className="flex"><PopoverTrigger asChild><button type="button" className="p-1.5 rounded hover:bg-muted transition-colors flex items-center justify-center relative"><TypeIcon className="size-[18px]" strokeWidth={2}/><div className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full" style={{ backgroundColor: editor.getAttributes("textStyle").color || "#000" }}/></button></PopoverTrigger></div></TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Text Color</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-48 p-2"><div className="grid grid-cols-6 gap-1">{TEXT_COLORS.map((color) => (<button key={color} type="button" className="w-6 h-6 rounded border hover:scale-110 transition" style={{ backgroundColor: color }} onClick={() => editor.chain().focus().setColor(color).run()} />))}</div></PopoverContent>
          </Popover>

          <Popover>
            <Tooltip>
              <TooltipTrigger asChild><div className="flex"><PopoverTrigger asChild><button type="button" className="p-1.5 rounded hover:bg-muted transition-colors flex items-center justify-center"><HighlighterIcon className="size-[18px]" strokeWidth={2}/></button></PopoverTrigger></div></TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Highlight Color</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-48 p-2"><div className="grid grid-cols-6 gap-1">{HIGHLIGHT_COLORS.map((color) => (<button key={color} type="button" className="w-6 h-6 rounded border hover:scale-110 transition" style={{ backgroundColor: color }} onClick={() => editor.chain().focus().toggleHighlight({ color }).run()} />))}</div></PopoverContent>
          </Popover>

          <Divider />

          {/* Links and Images */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild><div className="flex"><PopoverTrigger asChild><button type="button" className="p-1.5 rounded hover:bg-muted text-foreground transition flex items-center justify-center"><Link2Icon className="size-[18px]" strokeWidth={2}/></button></PopoverTrigger></div></TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Insert Link (Ctrl+K)</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-72 p-3"><div className="flex gap-2"><Input placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="text-xs" /><Button size="sm" onClick={setLink}>Add</Button></div></PopoverContent>
          </Popover>
          
          <ToolbarButton icon={ImageIcon} onClick={() => { const url = window.prompt("Enter Image URL:"); if (url) editor.chain().focus().setImage({ src: url }).run() }} tooltip="Insert Image" />
          
          {/* NEW: Code Block */}
          <ToolbarButton icon={SquareCodeIcon} onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} tooltip="Insert Code Block" />

          <Divider />

          {/* Alignment */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex">
                  <PopoverTrigger asChild>
                    <button type="button" className="p-1.5 rounded hover:bg-muted text-foreground transition flex items-center justify-center">
                      {editor.isActive({ textAlign: "center" }) ? <AlignCenterIcon className="size-[18px]" strokeWidth={2}/> : 
                       editor.isActive({ textAlign: "right" }) ? <AlignRightIcon className="size-[18px]" strokeWidth={2}/> : 
                       editor.isActive({ textAlign: "justify" }) ? <AlignJustifyIcon className="size-[18px]" strokeWidth={2}/> : 
                       <AlignLeftIcon className="size-[18px]" strokeWidth={2}/>}
                    </button>
                  </PopoverTrigger>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Align</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-40 p-1 flex gap-1">
               <ToolbarButton icon={AlignLeftIcon} onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} tooltip="Left align" />
               <ToolbarButton icon={AlignCenterIcon} onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} tooltip="Center align" />
               <ToolbarButton icon={AlignRightIcon} onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} tooltip="Right align" />
               <ToolbarButton icon={AlignJustifyIcon} onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} tooltip="Justify" />
            </PopoverContent>
          </Popover>

          <Divider />

          {/* Lists & Checklists */}
          <ToolbarButton icon={ListOrderedIcon} onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} tooltip="Numbered list" />
          <ToolbarButton icon={ListIcon} onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} tooltip="Bulleted list" />
          {/* NEW: Task List */}
          <ToolbarButton icon={CheckSquareIcon} onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} tooltip="Task List (Checkboxes)" />

          <Divider />

          {/* NEW: Indentation */}
          <ToolbarButton icon={OutdentIcon} onClick={() => editor.chain().focus().liftListItem("listItem").run()} disabled={!editor.can().liftListItem("listItem")} tooltip="Decrease Indent" />
          <ToolbarButton icon={IndentIcon} onClick={() => editor.chain().focus().sinkListItem("listItem").run()} disabled={!editor.can().sinkListItem("listItem")} tooltip="Increase Indent" />

          <Divider />
          
          {/* Zoom */}
          <div className="flex items-center">
            <ToolbarButton icon={ZoomOut} onClick={() => setZoom(Math.max(50, zoom - 10))} tooltip="Zoom out" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setZoom(100)} className="text-xs w-10 text-center font-medium hover:bg-muted rounded py-1 transition">
                  {zoom}%
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Fit to 100%</TooltipContent>
            </Tooltip>
            <ToolbarButton icon={ZoomIn} onClick={() => setZoom(Math.min(200, zoom + 10))} tooltip="Zoom in" />
          </div>

          <div className="flex-grow" />
          
          {/* NEW: Search Popover */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex">
                  <PopoverTrigger asChild>
                    <button type="button" className="p-1.5 rounded hover:bg-muted text-foreground transition flex items-center justify-center mr-2 border border-transparent hover:border-border">
                      <SearchIcon className="size-[16px]" strokeWidth={2}/>
                    </button>
                  </PopoverTrigger>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Find in Document</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-64 p-2" align="end">
              <div className="flex gap-2">
                <Input placeholder="Search text..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="text-xs h-8" />
                <Button size="sm" className="h-8" onClick={handleSearch}>Find</Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Translation and Voice tools */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1 border border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <select onChange={(e) => { const selectedLang = supportedLanguages.find(lang => lang.code === e.target.value); if (selectedLang) setLanguage(selectedLang); }} className="bg-transparent border-none text-xs px-1 text-blue-500 font-medium focus:outline-none cursor-pointer" value={language.code}>
                  {supportedLanguages.map((lang) => (<option key={lang.code} value={lang.code} className="bg-background text-foreground">{lang.name}</option>))}
                </select>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Translation Language</TooltipContent>
            </Tooltip>

            <ToolbarButton icon={Languages} onClick={handleTranslate} tooltip="Translate Text" />
            <div className="w-[1px] h-4 bg-border mx-1" />
            <ToolbarButton icon={Mic} onClick={handleVoiceTyping} active={isListening} tooltip={isListening ? "Listening... (Click to stop)" : "Voice Typing"} />
            <ToolbarButton icon={Volume2Icon} onClick={handleReadAloud} active={isSpeaking} tooltip="Read Aloud" />
          </div>

        </div>
      </div>
    </TooltipProvider>
  )
}