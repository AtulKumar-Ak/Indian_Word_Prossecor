"use client"
import { ZoomIn, ZoomOut } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react"
import { useEditorStore } from "@/store/use-editor-store"
import { useLanguageStore } from "@/store/use-language-store"
import { useMutation } from "convex/react"; 
import { api } from "../../../../convex/_generated/api"; 
import { useTheme } from "next-themes"
import { useQuery } from "convex/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Undo2Icon, Redo2Icon, BoldIcon, ItalicIcon, UnderlineIcon, Mic, Volume2Icon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, TableIcon,
  ImageIcon, PrinterIcon, TypeIcon, HighlighterIcon, Link2Icon, ListIcon,
  ListOrderedIcon, Languages, StrikethroughIcon, FilePlusIcon, DownloadIcon,
  ScissorsIcon, CopyIcon, ClipboardIcon, MousePointerSquareIcon, PresentationIcon,
  MinusIcon, RemoveFormattingIcon, InfoIcon, SubscriptIcon, SuperscriptIcon,
  CodeIcon, SquareCodeIcon, CheckSquareIcon, IndentIcon, OutdentIcon, SearchIcon,
  SparklesIcon, ShareIcon, FileIcon, Layers3Icon, MailIcon, PenSquareIcon,
  ArrowLeftRightIcon, FolderPlusIcon, Trash2Icon, HistoryIcon, CloudDownloadIcon,
  Settings2Icon, GlobeIcon, ClipboardTypeIcon, AreaChartIcon, SmilePlusIcon, 
  ArrowRightToLineIcon, WrapTextIcon, BookmarkIcon, LayoutTemplateIcon, 
  MessageSquarePlusIcon, ChevronRightIcon, SunIcon, MoonIcon, ChevronDown, 
  TablePropertiesIcon, ShieldAlertIcon
} from "lucide-react"
import { DocumentShare } from "@/components/ui/document-share";
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { translateText } from "@/lib/translate"
import { generateSpeech } from "@/lib/tts"
import { Doc } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation"; // To redirect after 'New' or 'Delete'
import { toast } from "sonner"; // Assuming you use sonner for notifications
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog"
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
  Format: { en: "Format", hi: "प्रारूप", bn: "বিন্যাস", ta: "வடிவமைப்பு", te: "ఆకృతి", mr: "स्वरूप", gu: "ફોર્મેટ", kn: "ಸ್ವರೂಪ", ml: "ഫോർമാറ്റ്", pa: "ફਾਰਮੈਟ" },
  Tools: { en: "Tools", hi: "उपकरण", bn: "সরঞ্জাম", ta: "கருவிகள்", te: "సాధనాలు", mr: "साधने", gu: "સાધनों", kn: "ಉಪಕರಣಗಳು", ml: "ഉപകരണങ്ങൾ", pa: "ਟੂਲ" },
  Help: { en: "Help", hi: "मदद", bn: "সাহায্য", ta: "உதவி", te: "సహాయం", mr: "मदत", gu: "મદદ", kn: "ಸಹಾಯ", ml: "സഹായം", pa: "മਦਦ" },
}

interface ToolbarProps {
  initialData: Doc<"documents">;
}

export const Toolbar = ({ initialData }: ToolbarProps) => {
  const { editor, zoom, setZoom, togglePresentationMode, isAiSidebarOpen, toggleAiSidebar } = useEditorStore();
  const { language, supportedLanguages, setLanguage } = useLanguageStore()
  const { theme, setTheme } = useTheme();
  const [title, setTitle] = useState(initialData?.title || "Untitled Document");
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [searchText, setSearchText] = useState("") 
  const [isTranslating, setIsTranslating] = useState(false);
  const router = useRouter();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [details, setDetails] = useState<{
  words: number;
  characters: number;
  created: string;
  title: string;
  owner: string;
} | null>(null);

  
  const update = useMutation(api.documents.update);
  const create = useMutation(api.documents.create);
  const remove = useMutation(api.documents.remove);

  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const { isLandscape, setOrientation } = useEditorStore();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const createVersion = useMutation(api.documents.createVersion);
  const versions = useQuery(api.documents.getVersions, { documentId: initialData._id }) || [];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const FONT_FAMILIES = [
  // --- Standard Web Safe ---
  { label: "Arial", value: "Arial" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Georgia", value: "Georgia" },
  { label: "Verdana", value: "Verdana" },
  { label: "Tahoma", value: "Tahoma" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Impact", value: "Impact" },

  // --- Google Fonts: Sans Serif (Modern) ---
  { label: "Inter", value: "Inter" },
  { label: "Roboto", value: "Roboto" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Poppins", value: "Poppins" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Lato", value: "Lato" },
  { label: "Oswald", value: "Oswald" },
  { label: "Raleway", value: "Raleway" },
  { label: "Ubuntu", value: "Ubuntu" },

  // --- Google Fonts: Serif (Classic) ---
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Merriweather", value: "Merriweather" },
  { label: "Lora", value: "Lora" },
  { label: "Libre Baskerville", value: "Libre Baskerville" },
  { label: "PT Serif", value: "PT Serif" },
  { label: "Crimson Text", value: "Crimson Text" },

  // --- Google Fonts: Handwriting/Display ---
  { label: "Dancing Script", value: "Dancing Script" },
  { label: "Pacifico", value: "Pacifico" },
  { label: "Indie Flower", value: "Indie Flower" },
  { label: "Lobster", value: "Lobster" },
  { label: "Caveat", value: "Caveat" },
  { label: "Satisfy", value: "Satisfy" },

  // --- Google Fonts: Monospace ---
  { label: "Source Code Pro", value: "Source Code Pro" },
  { label: "Roboto Mono", value: "Roboto Mono" },
  { label: "Space Mono", value: "Space Mono" },
  { label: "Inconsolata", value: "Inconsolata" },

  // --- Indian Scripts (Regional) ---
  { label: "Hindi (Noto Sans)", value: "Noto Sans Devanagari" },
  { label: "Bengali (Noto Sans)", value: "Noto Sans Bengali" },
  { label: "Tamil (Noto Sans)", value: "Noto Sans Tamil" },
  { label: "Telugu (Noto Sans)", value: "Noto Sans Telugu" },
];

  const onSaveVersion = async () => {
  try {
    await createVersion({
      documentId: initialData._id,
      title: title,
      content: editor?.getHTML() || "",
    });
    toast.success("Version snapshot saved!");
  } catch (error) {
    toast.error("Failed to save version.");
  }
};

const onOpenDetails = () => {
  const stats = editor?.storage.characterCount;
  setDetails({
    words: stats?.words() || 0,
    characters: stats?.characters() || 0,
    created: new Date(initialData._creationTime).toLocaleString(),
    title: title,
    owner: "You",
  });
};

const onRestoreVersion = async (version: any) => {
  if (window.confirm("Restore this version? Current unsaved changes will be lost.")) {
    editor?.commands.setContent(version.content);
    setTitle(version.title);
    // Also update the main document in Convex
    await update({ id: initialData._id, title: version.title });
    toast.success("Document restored!");
    setIsHistoryOpen(false);
  }
};


  const onAddShortcut = () => {
  const shortcutData = `[InternetShortcut]\nURL=${window.location.href}`;
  const blob = new Blob([shortcutData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.url`;
  link.click();
  toast.success("Shortcut created! You can now drag this file into Google Drive.");
};

  const onEmailSubmit = () => {
  if (!targetEmail) return;

  const subject = encodeURIComponent(`BharatDocs: ${title}`);
  
  // Get the text content from TipTap
  const content = editor?.getText() || "";
  const body = encodeURIComponent(
    `I am sharing a document with you from BharatDocs:\n\n${content}\n\nSent via BharatDocs`
  );
  
  // This link tells Google to open a "Compose" window with your data
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${body}`;

  // Open in a new tab so the user doesn't lose their current document
  window.open(gmailLink, "_blank");
  
  // Cleanup UI
  setIsEmailModalOpen(false);
  setTargetEmail("");
  toast.success("Opening Gmail Compose...");
};
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      update({ id: initialData._id, title: newTitle || "Untitled Document" });
    }, 500);
  };

  // --- NEW: WORKING FILE MENU HANDLERS ---
  const handleOpenFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          editor?.chain().focus().setContent(content).run();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [editor]);

  const handleMakeCopy = useCallback(() => {
    const content = editor?.getHTML() || "";
    navigator.clipboard.writeText(content).then(() => {
       alert("Document HTML copied to clipboard! You can paste it into a new blank document.");
    });
  }, [editor]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Document link copied to clipboard!");
    }
  }, [title]);

  const handleEmail = useCallback(() => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Check out my document: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [title]);

  const handleDownloadHTML = useCallback(() => {
    const content = editor?.getHTML() || ""
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body { font-family: sans-serif; padding: 40px; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ccc; padding: 8px; }</style></head><body>${content}</body></html>`], { type: "text/html" })
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${title}.html`; a.click(); URL.revokeObjectURL(url);
  }, [editor, title]);

  const handleDownloadText = useCallback(() => {
    const content = editor?.getText() || ""
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${title}.txt`; a.click(); URL.revokeObjectURL(url);
  }, [editor, title]);

  const handleDetails = useCallback(() => {
    const text = editor?.getText() || "";
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    alert(`Document Details:\n\nWords: ${words}\nCharacters: ${chars}`);
  }, [editor]);

  const handlePrint = useCallback(() => {
    const content = editor?.getHTML()
    const printWindow = window.open("", "", "width=800,height=600")
    if (printWindow && content) { printWindow.document.write(`<html><head><title>Document</title><style>body { font-family: sans-serif; padding: 40px; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ccc; padding: 8px; }</style></head><body>${content}</body></html>`); printWindow.document.close(); printWindow.print(); }
  }, [editor]);

  // --- EXISTING IMAGE & CHART HANDLERS ---
  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          editor?.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);
  
  const handleCameraUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          editor?.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);
  
  const handleInsertChart = (chartType: string) => {
    const labelsStr = window.prompt("Enter labels separated by commas (e.g., Jan,Feb,Mar):", "Jan,Feb,Mar,Apr");
    if (!labelsStr) return;
    const dataStr = window.prompt("Enter data values separated by commas (e.g., 10,25,15):", "10,25,15,30");
    if (!dataStr) return;
    const labels = labelsStr.split(',').map(s => s.trim());
    const data = dataStr.split(',').map(s => Number(s.trim()));
    const chartConfig = { type: chartType, data: { labels: labels, datasets: [{ label: 'Dataset 1', data: data }] } };
    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
    const url = `https://quickchart.io/chart?c=${encodedConfig}&w=500&h=300`;
    editor?.chain().focus().setImage({ src: url }).run();
  };

  const onNew = async () => {
    try {
      const documentId = await create({ title: "Untitled Document" });
      router.push(`/documents/${documentId}`);
      toast.success("New document created!");
    } catch (error) {
      toast.error("Failed to create new document.");
    }
  };

  const onCopy = async () => {
    try {
      const documentId = await create({ 
        title: `Copy of ${initialData.title}`,
        // Note: You might need to update your 'create' mutation to accept 'initialContent' 
        // if you want to copy the TipTap content as well.
      });
      router.push(`/documents/${documentId}`);
      toast.success("Copy created!");
    } catch (error) {
      toast.error("Failed to copy document.");
    }
  };

  const onRename = () => {
    const newTitle = window.prompt("Enter new title:", title);
    if (newTitle && newTitle !== title) {
      setTitle(newTitle);
      update({ id: initialData._id, title: newTitle });
    }
  };
  
  const onDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this document?");
    if (!confirmed) return;
    
    try {
      await remove({ id: initialData._id });
      router.replace("/");
      toast.success("Document deleted.");
    } catch (error) {
      toast.error("Failed to delete document.");
    }
  };

  const onDownloadJSON = () => {
    const content = editor?.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.json`;
    a.click();
  };
  const onEmailDocument = async () => {
  const email = window.prompt("Enter recipient email:");
  if (!email) return;

  const content = editor?.getHTML();
  
  const response = await fetch("/api/send-email", {
    method: "POST",
    body: JSON.stringify({ to: email, subject: title, html: content }),
  });

  if (response.ok) alert("Email sent successfully!");
};



// 1. Add this ref at the top of your component (with your other refs)

// 1. Ensure these refs are at the top of your component
const recognitionRef = useRef<any>(null);
const shouldListenRef = useRef(false);
const lastInsertedLengthRef = useRef(0); // Tracks how much of the current sentence we already typed

const handleVoiceTyping = useCallback(() => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    toast.error("Speech recognition not supported.");
    return;
  }

  // --- MANUAL STOP ---
  if (isListening) {
    shouldListenRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    return;
  }

  // --- START ---
  shouldListenRef.current = true;
  const recognition = new SpeechRecognition();
  recognitionRef.current = recognition;

  recognition.lang = language.code;
  recognition.continuous = true;
  recognition.interimResults = true; // THIS IS KEY: It gives words before the sentence is done

  recognition.onstart = () => {
    setIsListening(true);
    lastInsertedLengthRef.current = 0; // Reset for new session
    
    // --- 1 MINUTE AUTO-RESTART ---
    setTimeout(() => {
      if (shouldListenRef.current && recognitionRef.current === recognition) {
        console.log("60s refresh: Keeping the mic fresh...");
        recognition.stop(); 
      }
    }, 60000);
  };

  recognition.onresult = (event: any) => {
    if (!editor) return;

    let currentTranscript = "";
    // Build the transcript from the current result index
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      currentTranscript += event.results[i][0].transcript;
    }

    // Calculate only the NEW words spoken since the last 'onresult'
    const newText = currentTranscript.slice(lastInsertedLengthRef.current);

    if (newText.trim().length > 0) {
      // Insert the words instantly
      editor.chain().focus().insertContent(newText).run();
      
      // Update our tracker
      lastInsertedLengthRef.current = currentTranscript.length;
    }

    // If the browser finishes a sentence, reset the local tracker for the next one
    if (event.results[event.results.length - 1].isFinal) {
      lastInsertedLengthRef.current = 0;
    }
  };

  recognition.onerror = (event: any) => {
    if (event.error === 'no-speech') return;
    if (event.error === 'aborted') return; // Ignore restarts
    console.error("Speech Error:", event.error);
    setIsListening(false);
    shouldListenRef.current = false;
  };

  recognition.onend = () => {
    // --- THE RESTART LOOP ---
    if (shouldListenRef.current) {
      lastInsertedLengthRef.current = 0;
      try {
        recognition.start();
      } catch (e) {
        console.log("Restarting...");
      }
    }
  };

  recognition.start();
}, [editor, isListening, language]);

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
    } catch (error) { alert("Service busy. Please try again in a moment."); } finally { setIsTranslating(false); }
  }, [editor, language.code, isTranslating]);

  const handleReadAloud = useCallback(async () => {
  // 1. STOP LOGIC
  if (isSpeaking) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
    return;
  }

  // 2. START LOGIC
  const text = editor?.getText() || "";
  if (!text.trim()) return;

  setIsSpeaking(true);
  const loadingToast = toast.loading("Preparing BharatDocs Voice...");

  try {
    const base64Audio = await generateSpeech(text, language.code);
    
    if (base64Audio) {
      toast.dismiss(loadingToast);
      
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      // THE FIX: Short 500ms delay to prevent clipping the first words
      setTimeout(async () => {
        try {
          if (audioRef.current === audio) { // Ensure we haven't stopped it already
            await audio.play();
          }
        } catch (playError) {
          console.error("Playback failed:", playError);
          setIsSpeaking(false);
        }
      }, 500); 

    } else {
      setIsSpeaking(false);
      toast.dismiss(loadingToast);
    }
  } catch (error) {
    console.error("TTS Error:", error);
    toast.dismiss(loadingToast);
    setIsSpeaking(false);
  }
}, [editor, isSpeaking, language.code]);

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

  const getMenuName = (baseName: string) => {
    const code = language.code;
    const trans = menuTranslations[baseName as keyof typeof menuTranslations]?.[code as keyof typeof menuTranslations[keyof typeof menuTranslations]] || baseName;
    return trans === baseName ? baseName : `${baseName} / ${trans}`;
  };

  const TopMenu = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-2 py-1 text-xs sm:px-2.5 sm:text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors focus:outline-none focus:bg-muted">
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-1 bg-popover border border-border shadow-lg flex flex-col gap-0.5 z-50">
        {children}
      </PopoverContent>
    </Popover>
  );

  const TopMenuItem = ({ icon: Icon, label, shortcut, onClick, hasSubmenu, disabled }: { icon?: any, label: string, shortcut?: string, onClick: () => void, hasSubmenu?: boolean, disabled?: boolean }) => (
    <button disabled={disabled} onClick={onClick} className={cn("flex items-center justify-between w-full px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded text-left transition-colors", disabled && "opacity-50 cursor-not-allowed")}>
      <div className="flex items-center gap-2">{Icon && <Icon className="size-4 text-muted-foreground" />}<span>{label}</span></div>
      <div className="flex items-center gap-2">
        {shortcut && <span className="text-xs text-muted-foreground ml-2">{shortcut}</span>}
        {hasSubmenu && <ChevronRightIcon className="size-3.5 text-muted-foreground" />}
      </div>
    </button>
  );

  const TopMenuSubItem = ({ icon: Icon, label, disabled, children }: { icon?: any, label: string, disabled?: boolean, children: React.ReactNode }) => (
    <div className={cn("relative group w-full", disabled && "opacity-50 pointer-events-none")}>
      <button className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded text-left transition-colors">
        <div className="flex items-center gap-2">{Icon && <Icon className="size-4 text-muted-foreground" />}<span>{label}</span></div>
        <div className="flex items-center gap-2">
          <ChevronRightIcon className="size-3.5 text-muted-foreground" />
        </div>
      </button>
      <div className="absolute left-full top-0 ml-1 hidden group-hover:flex flex-col bg-popover border border-border shadow-xl p-1 rounded-md min-w-[200px] z-[100] animate-in fade-in zoom-in-95">
        {children}
      </div>
    </div>
  );

  const MenuDivider = () => <div className="h-[1px] bg-border my-1 w-full" />;

  const ToolbarButton = ({ icon: Icon, onClick, active = false, tooltip, disabled = false, className }: { icon: any, onClick: () => void, active?: boolean, tooltip: string, disabled?: boolean, className?: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={onClick} disabled={disabled} className={cn("p-[7px] rounded-full transition-colors disabled:opacity-50 flex items-center justify-center", active ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "hover:bg-slate-200 dark:hover:bg-neutral-700 text-foreground", className)}>
          <Icon className="size-[17px]" strokeWidth={2} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs font-medium bg-popover text-popover-foreground border-border">{tooltip}</TooltipContent>
    </Tooltip>
  )

  const Divider = () => <div className="w-[1px] h-5 bg-slate-300 dark:bg-neutral-700 mx-1" />;

  const ListPreview = ({ items }: { items: string[] }) => (
    <div className="flex flex-col gap-1.5 text-muted-foreground w-full px-2 py-1">
      <div className="flex items-center gap-1.5"><span className="text-[10px] w-3 text-center">{items[0]}</span><div className="h-1 w-8 bg-slate-300 dark:bg-neutral-600 rounded-full"/></div>
      <div className="flex items-center gap-1.5 ml-3"><span className="text-[10px] w-3 text-center">{items[1]}</span><div className="h-1 w-6 bg-slate-300 dark:bg-neutral-600 rounded-full"/></div>
      <div className="flex items-center gap-1.5 ml-6"><span className="text-[10px] w-3 text-center">{items[2]}</span><div className="h-1 w-4 bg-slate-300 dark:bg-neutral-600 rounded-full"/></div>
    </div>
  );

  const TableGridPicker = () => {
    const [hovered, setHovered] = useState({ r: 0, c: 0 });
    return (
      <div className="p-2 flex flex-col bg-popover rounded-md">
        <div className="text-xs text-muted-foreground mb-2 text-center font-medium">
          {hovered.r > 0 ? `${hovered.c} x ${hovered.r}` : "Insert Table"}
        </div>
        <div className="flex flex-col gap-[1px]" onMouseLeave={() => setHovered({ r: 0, c: 0 })}>
          {Array.from({ length: 10 }).map((_, row) => (
            <div key={row} className="flex gap-[1px]">
              {Array.from({ length: 10 }).map((_, col) => (
                <button
                  key={col}
                  type="button"
                  onMouseEnter={() => setHovered({ r: row + 1, c: col + 1 })}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor.chain().focus().insertTable({ rows: row + 1, cols: col + 1, withHeaderRow: true }).run();
                    document.body.click(); 
                  }}
                  className={cn(
                    "w-3.5 h-3.5 border transition-colors duration-75",
                    (row < hovered.r && col < hovered.c) 
                      ? "bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-500" 
                      : "border-slate-300 dark:border-neutral-600 bg-transparent hover:border-blue-400"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const currentFontFamily = editor.getAttributes("textStyle").fontFamily?.replace(/['"]+/g, '') || "Mangal";
  const currentFontSize = editor.getAttributes("textStyle").fontSize?.replace(/px/g, '') || "14";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col bg-background w-full">
        
        {/* === TOP MENU ROW === */}
        <div className="flex flex-col gap-2 px-3 py-1.5 border-b border-border relative z-50 bg-background sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-2">
          <div className="flex items-center whitespace-nowrap sm:mr-4">
            <img src="/logo.png" alt="BharatDocs Logo" className="h-8 w-10 mr-2" />
            <span className="font-bold text-lg text-[#F69836]">Bharat</span>
            <span className="text-lg text-[#2F87C7]">Docs</span>
          </div>
          
          <div className="flex flex-col justify-center w-full sm:w-auto">
           <Input 
            id="document-title-input"
            type="text" 
            value={title}
            onChange={onTitleChange}
            className="h-6 w-full max-w-[260px] bg-transparent text-foreground border-transparent hover:border-border focus:border-blue-500 px-1 py-0 shadow-none text-sm font-medium focus-visible:ring-0" 
            />
            <div className="flex items-center gap-1 mt-0.5 flex-nowrap max-w-full overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
               
               {/* --- COMPLETELY REBUILT FILE MENU --- */}
               <TopMenu label={getMenuName("File")}>
                 {/* --- CORE ACTIONS --- */}
  <TopMenuSubItem icon={FilePlusIcon} label="New">
    <TopMenuItem label="Document" onClick={() => window.open('/', '_blank')} />
  </TopMenuSubItem>

  <TopMenuItem icon={FileIcon} label="Open" shortcut="Ctrl+O" onClick={handleOpenFile} />
  <TopMenuItem icon={Layers3Icon} label="Make a copy" onClick={handleMakeCopy || onCopy} />

  <MenuDivider />

  {/* --- SHARE --- */}
  <TopMenuSubItem icon={ShareIcon} label="Share">
    <TopMenuItem label="Share with others" onClick={handleShare} />
    <TopMenuItem label="Publish to web" onClick={() => alert("Public routing setup required.")} />
  </TopMenuSubItem>

  {/* --- EMAIL --- */}
  <TopMenuSubItem icon={MailIcon} label="Email">
    <TopMenuItem label="Email this file" onClick={handleEmail || (() => setIsEmailModalOpen(true))} />
  </TopMenuSubItem>

  {/* --- DOWNLOAD --- */}
  <TopMenuSubItem icon={DownloadIcon} label="Download">
    <TopMenuItem label="PDF document (.pdf)" onClick={handlePrint} />
    <TopMenuItem label="Web page (.html)" onClick={handleDownloadHTML} />
    <TopMenuItem label="Plain text (.txt)" onClick={handleDownloadText} />
  </TopMenuSubItem>

  <MenuDivider />

  {/* --- FILE MANAGEMENT --- */}
  <TopMenuItem icon={PenSquareIcon} label="Rename" onClick={() => document.getElementById("document-title-input")?.focus()} />
  <TopMenuItem icon={FolderPlusIcon} label="Add shortcut to Drive" onClick={onAddShortcut || (() => alert("Google Drive API integration required."))} />
  <TopMenuItem icon={Trash2Icon} label="Move to bin" onClick={onDelete || (() => alert("Delete from dashboard."))} />

  <MenuDivider />

  {/* --- VERSION CONTROL (IMPORTANT ADDITION) --- */}
  <TopMenuSubItem icon={HistoryIcon} label="Version history">
    <TopMenuItem label="Save Current Version" onClick={onSaveVersion} />
    <TopMenuItem label="See Version history" shortcut="Ctrl+Alt+H" onClick={() => setIsHistoryOpen(true)} />
  </TopMenuSubItem>

  <TopMenuItem icon={CloudDownloadIcon} label="Make available offline" onClick={() => alert("Offline mode requires PWA setup.")} />

  <MenuDivider />

  {/* --- DETAILS --- */}
  <TopMenuItem icon={InfoIcon} label="Details" onClick={handleDetails || onOpenDetails} />

  {/* --- LANGUAGE --- */}
  <TopMenuSubItem icon={GlobeIcon} label="Language">
    {supportedLanguages.map(lang => (
      <TopMenuItem key={lang.code} label={lang.name} onClick={() => setLanguage(lang)} />
    ))}
  </TopMenuSubItem>

  {/* --- SETTINGS --- */}
  <TopMenuItem icon={Settings2Icon} label="Page setup" onClick={() => setIsPageSetupOpen(true)} />

  {/* --- PRINT --- */}
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
                 <TopMenuItem icon={MousePointerSquareIcon} label="Select all" shortcut="Ctrl+A" onClick={() => editor.chain().focus().selectAll().run()} />
               </TopMenu>

               <TopMenu label={getMenuName("View")}>
                 <TopMenuItem icon={ZoomIn} label="Zoom In" onClick={() => setZoom(Math.min(200, zoom + 10))} />
                 <TopMenuItem icon={ZoomOut} label="Zoom Out" onClick={() => setZoom(Math.max(50, zoom - 10))} />
                 <TopMenuItem label="100% Zoom" onClick={() => setZoom(100)} />
                 <MenuDivider />
                 <TopMenuItem icon={PresentationIcon} label="Full Screen (Preview)" onClick={togglePresentationMode} />
               </TopMenu>

               <TopMenu label={getMenuName("Insert")}>
                 <TopMenuSubItem icon={ImageIcon} label="Image">
                   <TopMenuItem label="Upload from computer" onClick={handleImageUpload} />
                   <TopMenuItem label="Camera" onClick={handleCameraUpload} />
                   <TopMenuItem label="By URL" onClick={() => {
                     const url = window.prompt("Enter Image URL:")
                     if (url) editor.chain().focus().setImage({ src: url }).run()
                   }} />
                 </TopMenuSubItem>

                 <TopMenuSubItem icon={TableIcon} label="Table">
                    <TableGridPicker />
                 </TopMenuSubItem>

                 <TopMenuItem icon={Link2Icon} label="Link" shortcut="Ctrl+K" onClick={() => {
                   const url = window.prompt("Enter URL:")
                   if (url) editor.chain().focus().setLink({ href: url }).run()
                 }} />

                 <TopMenuSubItem icon={AreaChartIcon} label="Chart">
                   <TopMenuItem label="Bar Chart" onClick={() => handleInsertChart('bar')} />
                   <TopMenuItem label="Column Chart" onClick={() => handleInsertChart('bar')} />
                   <TopMenuItem label="Line Chart" onClick={() => handleInsertChart('line')} />
                   <TopMenuItem label="Pie Chart" onClick={() => handleInsertChart('pie')} />
                   <TopMenuItem label="Doughnut Chart" onClick={() => handleInsertChart('doughnut')} />
                 </TopMenuSubItem>

                 <MenuDivider />
                 <TopMenuItem icon={MinusIcon} label="Horizontal line" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
                 <TopMenuSubItem icon={WrapTextIcon} label="Break">
                   <TopMenuItem label="Page break" shortcut="Ctrl+Enter" onClick={() => editor.chain().focus().setHardBreak().run()} />
                 </TopMenuSubItem>
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
                 <TopMenuSubItem icon={TablePropertiesIcon} label="Table options" disabled={!editor.can().deleteTable()}>
                   <TopMenuItem label="Insert row above" disabled={!editor.can().addRowBefore()} onClick={() => editor.chain().focus().addRowBefore().run()} />
                   <TopMenuItem label="Insert row below" disabled={!editor.can().addRowAfter()} onClick={() => editor.chain().focus().addRowAfter().run()} />
                   <TopMenuItem label="Delete row" disabled={!editor.can().deleteRow()} onClick={() => editor.chain().focus().deleteRow().run()} />
                   <MenuDivider />
                   <TopMenuItem label="Insert column left" disabled={!editor.can().addColumnBefore()} onClick={() => editor.chain().focus().addColumnBefore().run()} />
                   <TopMenuItem label="Insert column right" disabled={!editor.can().addColumnAfter()} onClick={() => editor.chain().focus().addColumnAfter().run()} />
                   <TopMenuItem label="Delete column" disabled={!editor.can().deleteColumn()} onClick={() => editor.chain().focus().deleteColumn().run()} />
                   <MenuDivider />
                   <TopMenuItem label="Merge cells" disabled={!editor.can().mergeCells()} onClick={() => editor.chain().focus().mergeCells().run()} />
                   <TopMenuItem label="Split cell" disabled={!editor.can().splitCell()} onClick={() => editor.chain().focus().splitCell().run()} />
                   <MenuDivider />
                   <TopMenuItem label="Delete table" disabled={!editor.can().deleteTable()} onClick={() => editor.chain().focus().deleteTable().run()} />
                 </TopMenuSubItem>
                 <MenuDivider />
                 <TopMenuItem icon={RemoveFormattingIcon} label="Clear Formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} />
               </TopMenu>

               <TopMenu label={getMenuName("Tools")}>
                 <TopMenuItem icon={Languages} label="Translate Document" onClick={handleTranslate} />
                 <ToolbarButton 
                    icon={Mic} 
                    onClick={handleVoiceTyping} 
                    active={isListening} 
                    className={cn(isListening && "animate-pulse text-red-500")}
                    tooltip={isListening ? "Stop Voice Typing" : "Start Voice Typing"} 
                  />
                 <TopMenuItem icon={Volume2Icon} label="Read Aloud" onClick={handleReadAloud} />
               </TopMenu>

               <TopMenu label={getMenuName("Help")}>
                 <TopMenuItem icon={InfoIcon} label="About BharatDocs" onClick={() => alert("BharatDocs - Rich Text Editor")} />
               </TopMenu>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-start">
            <DocumentShare documentId={initialData._id} />
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-8 px-3 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center gap-2">
                    <SunIcon className="h-4 w-4 block dark:hidden" />
                    <MoonIcon className="h-4 w-4 hidden dark:block" />
                    <span className="text-xs font-medium block dark:hidden">Light</span>
                    <span className="text-xs font-medium hidden dark:block">Dark</span>
                  </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Toggle Light/Dark Mode</TooltipContent>
            </Tooltip>
          </div>
          
        </div>

        {/* === MAIN ACTION TOOLBAR === */}
        <div className="flex flex-col gap-1.5 w-full bg-background py-1.5 px-2 z-40 shadow-sm border-b border-border sm:py-2 sm:px-4 lg:flex-row lg:items-center">
          
          <div className="flex items-center flex-nowrap gap-x-0.5 px-2 py-1 bg-[#f0f4f9] dark:bg-[#1e1f22] rounded-[24px] custom-scrollbar relative w-full overflow-x-auto sm:px-3 sm:py-1.5 sm:rounded-[32px]">
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex">
                    <PopoverTrigger asChild>
                      <button type="button" className="p-[7px] rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground transition flex items-center justify-center mr-1 relative">
                        <SearchIcon className="size-[17px]" strokeWidth={2}/>
                      </button>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Find in Document</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="flex gap-2">
                  <Input placeholder="Search text..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="text-xs h-8" />
                  <Button size="sm" className="h-8" onClick={handleSearch}>Find</Button>
                </div>
              </PopoverContent>
            </Popover>

            <ToolbarButton icon={Undo2Icon} onClick={() => editor.chain().focus().undo().run()} tooltip="Undo (Ctrl+Z)" disabled={!editor.can().undo()} />
            <ToolbarButton icon={Redo2Icon} onClick={() => editor.chain().focus().redo().run()} tooltip="Redo (Ctrl+Y)" disabled={!editor.can().redo()} />
            <ToolbarButton icon={PrinterIcon} onClick={handlePrint} tooltip="Print (Ctrl+P)" />
            
            <Divider />

            <div className="flex items-center">
              <ToolbarButton icon={ZoomOut} onClick={() => setZoom(Math.max(50, zoom - 10))} tooltip="Zoom out" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setZoom(100)} className="text-[13px] w-12 text-center font-medium hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-md py-1 transition">
                    {zoom}%
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Fit to 100%</TooltipContent>
              </Tooltip>
              <ToolbarButton icon={ZoomIn} onClick={() => setZoom(Math.min(200, zoom + 10))} tooltip="Zoom in" />
            </div>

            <Divider />

            <select 
              title="Font Family"
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} 
              className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-[13px] px-2 py-1.5 rounded-md text-foreground focus:outline-none cursor-pointer font-medium border-none outline-none min-w-[140px]" 
              value={editor.getAttributes("textStyle").fontFamily?.replace(/['"]+/g, '') || "Arial"}
            >
              {FONT_FAMILIES.map((font) => (
                <option 
                  key={font.value} 
                  value={font.value} 
                  className="bg-background text-foreground py-1"
                  style={{ fontFamily: font.value }} // Real-time preview in the dropdown
                >
                  {font.label}
                </option>
              ))}
            </select>

            <Divider />

            <select 
              title="Font Size"
              onChange={(e) => { const size = e.target.value; editor.chain().focus().setMark("textStyle", { fontSize: `${size}px` }).run() }} 
              className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-[13px] px-2 py-1.5 rounded-md w-[52px] font-medium text-foreground focus:outline-none cursor-pointer" 
              value={currentFontSize}
            >
              {FONT_SIZES.map((size) => (<option key={size} value={size} className="bg-background text-foreground">{size}</option>))}
            </select>
            
            <Divider />

            <ToolbarButton icon={BoldIcon} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} tooltip="Bold (Ctrl+B)" />
            <ToolbarButton icon={ItalicIcon} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} tooltip="Italic (Ctrl+I)" />
            <ToolbarButton icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} tooltip="Underline (Ctrl+U)" />
            
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex">
                    <PopoverTrigger asChild>
                      <button type="button" className="p-[7px] rounded-full hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center relative">
                        <TypeIcon className="size-[17px]" strokeWidth={2}/>
                        <div className="absolute bottom-[3px] left-2 right-2 h-[3px] rounded-full" style={{ backgroundColor: editor.getAttributes("textStyle").color || "#000" }}/>
                      </button>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Text Color</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-48 p-2"><div className="grid grid-cols-6 gap-1">{TEXT_COLORS.map((color) => (<button key={color} type="button" className="w-6 h-6 rounded border hover:scale-110 transition" style={{ backgroundColor: color }} onClick={() => editor.chain().focus().setColor(color).run()} />))}</div></PopoverContent>
            </Popover>

            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex">
                    <PopoverTrigger asChild>
                      <button type="button" className="p-[7px] rounded-full hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center">
                        <HighlighterIcon className="size-[17px]" strokeWidth={2}/>
                      </button>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Highlight Color</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-48 p-2"><div className="grid grid-cols-6 gap-1">{HIGHLIGHT_COLORS.map((color) => (<button key={color} type="button" className="w-6 h-6 rounded border hover:scale-110 transition" style={{ backgroundColor: color }} onClick={() => editor.chain().focus().toggleHighlight({ color }).run()} />))}</div></PopoverContent>
            </Popover>

            <Divider />

            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex">
                    <PopoverTrigger asChild>
                      <button type="button" className="p-[7px] rounded-full hover:bg-slate-200 dark:hover:bg-neutral-700 text-foreground transition flex items-center justify-center">
                        <Link2Icon className="size-[17px]" strokeWidth={2}/>
                      </button>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Insert Link (Ctrl+K)</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-72 p-3"><div className="flex gap-2"><Input placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="text-xs" /><Button size="sm" onClick={setLink}>Add</Button></div></PopoverContent>
            </Popover>
            
            <ToolbarButton icon={ImageIcon} onClick={handleImageUpload} tooltip="Insert Image" />
            
            <Divider />

            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex">
                    <PopoverTrigger asChild>
                      <button type="button" className="p-[7px] rounded-full hover:bg-slate-200 dark:hover:bg-neutral-700 text-foreground transition flex items-center justify-center">
                        {editor.isActive({ textAlign: "center" }) ? <AlignCenterIcon className="size-[17px]" strokeWidth={2}/> : 
                         editor.isActive({ textAlign: "right" }) ? <AlignRightIcon className="size-[17px]" strokeWidth={2}/> : 
                         editor.isActive({ textAlign: "justify" }) ? <AlignJustifyIcon className="size-[17px]" strokeWidth={2}/> : 
                         <AlignLeftIcon className="size-[17px]" strokeWidth={2}/>}
                      </button>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Align</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-40 p-1 flex gap-1">
                 <ToolbarButton icon={AlignLeftIcon} onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} tooltip="Left align" className="rounded-md" />
                 <ToolbarButton icon={AlignCenterIcon} onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} tooltip="Center align" className="rounded-md" />
                 <ToolbarButton icon={AlignRightIcon} onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} tooltip="Right align" className="rounded-md" />
                 <ToolbarButton icon={AlignJustifyIcon} onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} tooltip="Justify" className="rounded-md" />
              </PopoverContent>
            </Popover>

            <Divider />

            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn("p-[7px] rounded-l-full transition-colors flex items-center justify-center", editor.isActive("orderedList") ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "hover:bg-slate-200 dark:hover:bg-neutral-700 text-foreground")}>
                    <ListOrderedIcon className="size-[17px]" strokeWidth={2} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Numbered list</TooltipContent>
              </Tooltip>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex">
                      <PopoverTrigger asChild>
                        <button type="button" className="p-[7px] pl-0.5 pr-1.5 rounded-r-full hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center">
                          <ChevronDown className="size-3 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Numbered list options</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-64 p-2 shadow-lg" align="start">
                  <div className="grid grid-cols-3 gap-1">
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['1.', 'a.', 'i.']} /></button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['1)', 'a)', 'i)']} /></button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['1.', '1.1.', '1.1.1.']} /></button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['A.', 'a.', 'i.']} /></button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['I.', 'A.', '1.']} /></button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['01.', 'a.', 'i.']} /></button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn("p-[7px] rounded-l-full transition-colors flex items-center justify-center", editor.isActive("bulletList") ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "hover:bg-slate-200 dark:hover:bg-neutral-700 text-foreground")}>
                    <ListIcon className="size-[17px]" strokeWidth={2} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Bulleted list</TooltipContent>
              </Tooltip>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex">
                      <PopoverTrigger asChild>
                        <button type="button" className="p-[7px] pl-0.5 pr-1.5 rounded-r-full hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center">
                          <ChevronDown className="size-3 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs bg-popover text-popover-foreground border-border">Bulleted list options</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-64 p-2 shadow-lg" align="start">
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['●', '○', '■']} /></button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['❖', '➢', '■']} /></button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['❑', '❑', '❑']} /></button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['➔', '◆', '●']} /></button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['★', '○', '■']} /></button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="border border-transparent hover:border-border hover:bg-muted p-1 rounded-lg transition-colors"><ListPreview items={['➢', '○', '■']} /></button>
                  </div>
                  <MenuDivider />
                  <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded text-left transition-colors mt-1">
                    <CheckSquareIcon className="size-4 text-muted-foreground" />
                    <span>Checklist menu</span>
                    <ChevronRightIcon className="size-3.5 text-muted-foreground ml-auto" />
                  </button>
                </PopoverContent>
              </Popover>
            </div>

            <ToolbarButton icon={CheckSquareIcon} onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} tooltip="Task List" />
            <ToolbarButton icon={OutdentIcon} onClick={() => editor.chain().focus().liftListItem("listItem").run()} disabled={!editor.can().liftListItem("listItem")} tooltip="Decrease Indent" />
            <ToolbarButton icon={IndentIcon} onClick={() => editor.chain().focus().sinkListItem("listItem").run()} disabled={!editor.can().sinkListItem("listItem")} tooltip="Increase Indent" />
            
            <Divider />

            <ToolbarButton icon={SubscriptIcon} onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} tooltip="Subscript" />
            <ToolbarButton icon={SuperscriptIcon} onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} tooltip="Superscript" />
            <ToolbarButton icon={SquareCodeIcon} onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} tooltip="Insert Code Block" />

          </div>

          <div className="flex items-center flex-wrap gap-x-0.5 px-2 py-1 bg-[#f0f4f9] dark:bg-[#1e1f22] rounded-[24px] w-full lg:w-auto lg:flex-nowrap lg:flex-shrink-0 lg:ml-4 sm:px-3 sm:py-1.5 sm:rounded-[32px]">
            
            <select 
              title="Translation Language"
              onChange={(e) => { const selectedLang = supportedLanguages.find(lang => lang.code === e.target.value); if (selectedLang) setLanguage(selectedLang); }} 
              className="bg-transparent border-none text-[13px] px-2 text-blue-600 dark:text-blue-400 font-medium focus:outline-none cursor-pointer" 
              value={language.code}
            >
              {supportedLanguages.map((lang) => (<option key={lang.code} value={lang.code} className="bg-background text-foreground">{lang.name}</option>))}
            </select>

            <ToolbarButton icon={Languages} onClick={handleTranslate} tooltip="Translate Text" />
            <div className="w-[1px] h-5 bg-slate-300 dark:bg-neutral-700 mx-1" />
            <ToolbarButton icon={Mic} onClick={handleVoiceTyping} active={isListening} tooltip={isListening ? "Listening... (Click to stop)" : "Voice Typing"} />
            <ToolbarButton icon={Volume2Icon} onClick={handleReadAloud} active={isSpeaking} tooltip="Read Aloud" />
            
            <div className="w-[1px] h-5 bg-slate-300 dark:bg-neutral-700 mx-1" />
            
            <Button
               size="sm"
               onClick={toggleAiSidebar}
               variant={isAiSidebarOpen ? "secondary" : "default"}
               className={cn("h-7 gap-1.5 px-3 rounded-full transition-colors ml-1", !isAiSidebarOpen && "bg-blue-600 hover:bg-blue-700 text-white")}
             >
               <SparklesIcon className="size-3.5" />
               {isAiSidebarOpen ? "Close AI" : "Ask AI"}
             </Button>

          </div>

        </div>
        {/* CUSTOM EMAIL MODAL */}
                <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Email Document</DialogTitle>
                      <DialogDescription>
                        Send a copy of "{title}" as an HTML email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                      <Input
                        type="email"
                        placeholder="recipient@example.com"
                        value={targetEmail}
                        onChange={(e) => setTargetEmail(e.target.value)}
                        disabled={isSending}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setIsEmailModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={onEmailSubmit} disabled={isSending}>
                        {isSending ? "Sending..." : "Send Email"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
      </div>
      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader className="border-b pb-4">
      <SheetTitle className="flex items-center gap-2">
        <HistoryIcon className="size-5 text-blue-600" />
        Version History
      </SheetTitle>
      <SheetDescription>
        View and restore previous snapshots of this document.
      </SheetDescription>
    </SheetHeader>

    <div className="flex flex-col gap-4 mt-6 overflow-y-auto h-[calc(100vh-150px)]">
      {versions.map((version) => (
        <div 
          key={version._id} 
          className="group flex flex-col gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-all cursor-pointer"
          onClick={() => onRestoreVersion(version)}
        >
          <div className="flex justify-between items-start">
            <span className="font-bold text-sm">{version.title}</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              Snapshot
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(version._creationTime).toLocaleString()}
          </div>
          <Button variant="link" className="p-0 h-fit text-xs text-blue-600 self-start opacity-0 group-hover:opacity-100 transition-opacity">
            Restore this version
          </Button>
        </div>
      ))}
      {versions.length === 0 && (
        <p className="text-center text-muted-foreground text-sm mt-10">
          No snapshots found. Click "Save Current Version" to create one.
        </p>
      )}
    </div>
  </SheetContent>
</Sheet>
{/* --- DOCUMENT DETAILS DIALOG --- */}
<Dialog open={!!details} onOpenChange={(open) => !open && setDetails(null)}>
  <DialogContent className="max-w-md bg-background border-none shadow-2xl">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-xl font-normal">
        <InfoIcon className="size-5 text-blue-600" />
        Document details
      </DialogTitle>
    </DialogHeader>

    {details && (
      <div className="py-4 space-y-3">
        <div className="grid grid-cols-2 py-2 border-b border-border/50">
          <span className="text-sm font-medium text-muted-foreground">Title</span>
          <span className="text-sm text-right font-semibold">{details.title}</span>
        </div>
        <div className="grid grid-cols-2 py-2 border-b border-border/50">
          <span className="text-sm font-medium text-muted-foreground">Word count</span>
          <span className="text-sm text-right font-mono text-blue-600">{details.words}</span>
        </div>
        {/* ... Add other rows using details.characters, details.created, etc. ... */}
      </div>
    )}

    <DialogFooter>
      <Button 
        onClick={() => setDetails(null)} 
        className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
{/* --- PAGE SETUP DIALOG --- */}
<Dialog open={isPageSetupOpen} onOpenChange={setIsPageSetupOpen}>
  <DialogContent className="max-w-[450px] bg-background border-none shadow-2xl p-0 overflow-hidden">
    <div className="p-6">
      <DialogTitle className="text-xl font-normal mb-6 text-foreground">Page setup</DialogTitle>
      
      <div className="space-y-8">
        {/* Orientation Section */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Orientation</h4>
          <div className="flex gap-10">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="orientation" 
                checked={!isLandscape} 
                onChange={() => setOrientation(false)}
                className="size-4 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">Portrait</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="orientation" 
                checked={isLandscape} 
                onChange={() => setOrientation(true)}
                className="size-4 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">Landscape</span>
            </label>
          </div>
        </div>

        {/* Paper Size Section (Visual Placeholder) */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Paper size</h4>
          <div className="relative">
            <select disabled className="w-full bg-muted/40 border border-border rounded-md px-3 py-2 text-sm appearance-none cursor-not-allowed opacity-70">
              <option>Letter (8.5" x 11")</option>
              <option>A4 (210mm x 297mm)</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
          </div>
        </div>

        {/* Page Color Section */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Page color</h4>
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-full border border-border bg-white shadow-sm ring-2 ring-offset-2 ring-blue-600/20" />
            <Button variant="outline" size="sm" disabled className="text-[11px] h-7 rounded-full px-4 border-slate-300">
              Change color
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/10">
      <Button 
        variant="ghost" 
        onClick={() => setIsPageSetupOpen(false)}
        className="text-blue-600 hover:text-blue-700 font-bold px-6 hover:bg-transparent"
      >
        Cancel
      </Button>
      <Button 
        onClick={() => setIsPageSetupOpen(false)}
        className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md"
      >
        OK
      </Button>
    </div>
  </DialogContent>
</Dialog>
    </TooltipProvider>
    
    
  )
  
}