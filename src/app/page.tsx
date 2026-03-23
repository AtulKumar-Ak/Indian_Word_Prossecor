"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api"; 
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "./(auth)/signin/signin";
import { useTheme } from "next-themes";
import { useState } from "react";
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  SunIcon, 
  MoonIcon, 
  Search,
  FileBox,
  Trash2,
  ExternalLink,
  Link2,
  ChevronsUpDown,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

// --- FULL 2-COLUMN GOOGLE DOCS RESUME ---
const SAFE_RESUME_JSON = JSON.stringify({
  type: "doc",
  content: [
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            // LEFT COLUMN (70% width)
            {
              type: "tableCell",
              attrs: { colwidth: [550] },
              content: [
                { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Your Name" }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit" }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "EXPERIENCE", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Company, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Job Title", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - PRESENT", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Company, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Job Title", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Company, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Job Title", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "EDUCATION", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "School Name, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Degree", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "School Name, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Degree", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "PROJECTS", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Project Name", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Detail", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit." }] }
              ]
            },
            // RIGHT COLUMN (30% width)
            {
              type: "tableCell",
              attrs: { colwidth: [250] },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "123 Your Street" }] },
                { type: "paragraph", content: [{ type: "text", text: "Your City, ST 12345" }] },
                { type: "paragraph", content: [{ type: "text", text: "(123) 456-7890", marks: [{ type: "bold" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "no_reply@example.com", marks: [{ type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph" },
                { type: "paragraph" },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "SKILLS", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Consectetuer adipiscing elit." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Sed diam nonummy nibh euismod tincidunt." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Laoreet dolore magna aliquam erat volutpat." }] },
                { type: "paragraph" },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "AWARDS", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit", marks: [{ type: "bold" }] }, { type: "text", text: " amet" }] },
                { type: "paragraph", content: [{ type: "text", text: "Consectetuer adipiscing elit, Sed diam nonummy" }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Nibh euismod tincidunt", marks: [{ type: "bold" }] }, { type: "text", text: " ut laoreet dolore magna aliquam erat volutpat." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit", marks: [{ type: "bold" }] }, { type: "text", text: " amet" }] },
                { type: "paragraph", content: [{ type: "text", text: "Consectetuer adipiscing elit, Sed diam nonummy" }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Nibh euismod tincidunt", marks: [{ type: "bold" }] }, { type: "text", text: " ut laoreet dolore magna aliquam erat volutpat." }] },
                { type: "paragraph" },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "LANGUAGES", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum, Dolor sit amet, Consectetuer" }] }
              ]
            }
          ]
        }
      ]
    }
  ]
});

const SAFE_LETTER_JSON = JSON.stringify({
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: "Your Name\nYour Address\nCity, ST 12345" }] },
    { type: "paragraph", content: [{ type: "text", text: "September 04, 20XX" }] },
    { type: "paragraph", content: [{ type: "text", text: "Recipient Name\nCompany Name\nCompany Address" }] },
    { type: "paragraph", content: [{ type: "text", text: "Dear [Recipient Name]," }] },
    { type: "paragraph", content: [{ type: "text", text: "Write the body of your formal letter here. Ensure your tone is professional and concise. Explain the purpose of your communication in the first paragraph." }] },
    { type: "paragraph", content: [{ type: "text", text: "Use the second paragraph to provide supporting details or context. You can include action items or requests in the concluding paragraph." }] },
    { type: "paragraph", content: [{ type: "text", text: "Sincerely," }] },
    { type: "paragraph", content: [{ type: "text", text: "Your Name" }] },
  ]
});

const SAFE_PROPOSAL_JSON = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Project Proposal" }] },
    { type: "paragraph", content: [{ type: "text", text: "Prepared for: Client Name", marks: [{ type: "bold" }] }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "1. Executive Summary" }] },
    { type: "paragraph", content: [{ type: "text", text: "Provide a brief overview of the project, the problem it solves, and the expected outcomes." }] },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "2. Project Goals" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Deliver phase 1 by Q3." }] }] }, { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Increase metric X by 20%." }] }] }] },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "3. Budget & Timeline" }] },
    { type: "paragraph", content: [{ type: "text", text: "Estimated cost: $XXX,XXX. Expected completion: 6 months." }] }
  ]
});

const SAFE_NOTES_JSON = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Class / Meeting Notes" }] },
    { type: "paragraph", content: [{ type: "text", text: "Date: 09/04/20XX", marks: [{ type: "bold" }] }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Main Topics" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Topic 1 discussed..." }] }] }, { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Topic 2 explored..." }] }] }] },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Action Items" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Follow up with team regarding X." }] }] }] }
  ]
});

// --- FULL CATEGORIZED TEMPLATE DATA ---
const TEMPLATE_CATEGORIES = [
  {
    category: "Recently used",
    templates: [
      { id: "blank", label: "Blank document", subLabel: "", isBlank: true, initialContent: null },
      { id: "resume_serif", label: "Resume", subLabel: "Serif", initialContent: SAFE_RESUME_JSON },
      { id: "letter_spearmint", label: "Letter", subLabel: "Spearmint", initialContent: SAFE_LETTER_JSON },
      { id: "proposal_tropic", label: "Project proposal", subLabel: "Tropic", initialContent: SAFE_PROPOSAL_JSON },
      { id: "brochure_geometric", label: "Brochure", subLabel: "Geometric", initialContent: SAFE_PROPOSAL_JSON },
    ]
  },
  {
    category: "CVs",
    templates: [
      { id: "cv_swiss", label: "Resume", subLabel: "Swiss", initialContent: SAFE_RESUME_JSON },
      { id: "cv_serif", label: "Resume", subLabel: "Serif", initialContent: SAFE_RESUME_JSON },
      { id: "cv_coral", label: "Resume", subLabel: "Coral", initialContent: SAFE_RESUME_JSON },
      { id: "cv_spearmint", label: "Resume", subLabel: "Spearmint", initialContent: SAFE_RESUME_JSON },
      { id: "cv_modern", label: "Resume", subLabel: "Modern writer", initialContent: SAFE_RESUME_JSON },
    ]
  },
  {
    category: "Personal",
    templates: [
      { id: "personal_recipe", label: "Recipe", subLabel: "Coral", initialContent: SAFE_NOTES_JSON },
      { id: "personal_pet", label: "Pet resume", subLabel: "Spearmint", initialContent: SAFE_RESUME_JSON },
    ]
  },
  {
    category: "Work",
    templates: [
      { id: "work_tropic", label: "Project proposal", subLabel: "Tropic", initialContent: SAFE_PROPOSAL_JSON },
      { id: "work_spearmint", label: "Project proposal", subLabel: "Spearmint", initialContent: SAFE_PROPOSAL_JSON },
      { id: "work_geometric", label: "Project proposal", subLabel: "Geometric", initialContent: SAFE_PROPOSAL_JSON },
      { id: "work_meeting1", label: "Meeting notes", subLabel: "Tropic", initialContent: SAFE_NOTES_JSON },
      { id: "work_meeting2", label: "Meeting notes", subLabel: "Modern writer", initialContent: SAFE_NOTES_JSON },
    ]
  },
  {
    category: "Education",
    templates: [
      { id: "edu_essay", label: "Essay", subLabel: "Playful", initialContent: SAFE_LETTER_JSON },
      { id: "edu_report1", label: "Report", subLabel: "Simple", initialContent: SAFE_PROPOSAL_JSON },
      { id: "edu_report2", label: "Report", subLabel: "Luxe", initialContent: SAFE_PROPOSAL_JSON },
      { id: "edu_notes", label: "Class Notes", subLabel: "Playful", initialContent: SAFE_NOTES_JSON },
      { id: "edu_biology", label: "9th Grade Biology", subLabel: "Simple", initialContent: SAFE_NOTES_JSON },
    ]
  },
  {
    category: "Sales",
    templates: [
      { id: "sales_quote", label: "Sales quote", subLabel: "by PandaDoc", initialContent: SAFE_PROPOSAL_JSON },
      { id: "sales_training", label: "Training proposal", subLabel: "by PandaDoc", initialContent: SAFE_PROPOSAL_JSON },
      { id: "sales_dev", label: "Software development...", subLabel: "by PandaDoc", initialContent: SAFE_PROPOSAL_JSON },
      { id: "sales_rfp", label: "Request for proposal", subLabel: "by PandaDoc", initialContent: SAFE_PROPOSAL_JSON },
    ]
  }
];

// --- Simple visual placeholders for the cards ---
const TemplateMockup = ({ type }: { type: string }) => {
  return (
    <div className="w-full h-full flex flex-col gap-1.5 p-1 px-2 opacity-60">
      <div className="h-3 w-1/2 bg-muted-foreground/30 rounded-sm mb-2" />
      <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
      <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
      <div className="h-1 w-5/6 bg-muted-foreground/20 rounded-full" />
      <div className="h-2 w-1/3 bg-muted-foreground/30 rounded-sm mt-3" />
      <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
      <div className="h-1 w-4/5 bg-muted-foreground/20 rounded-full" />
    </div>
  );
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  
  // State to toggle between quick-view and full template gallery
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const documents = useQuery(api.documents.get);
  const createDocument = useMutation(api.documents.create);
  const removeDocument = useMutation(api.documents.remove); 

  const onCreateTemplate = (title: string, initialContent: string | null) => {
    createDocument({ title, initialContent })
      .then((documentId) => {
        window.location.href = `/documents/${documentId}`;
      })
      .catch((error) => {
        console.error("Error creating document:", error);
        alert("Failed to create document.");
      });
  };

  const handleDelete = async (id: Id<"documents">) => {
    if (window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      try {
        await removeDocument({ id }); 
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/documents/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!"); 
  };

  return (
    <div className="min-h-screen bg-background">
      
      <SignedOut>
        <div className="min-h-screen bg-[#0b0d0f] text-white relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-[-140px] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_top,#ffb454,transparent_65%)] opacity-70 blur-2xl" />
          <div className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_top,#44c2ff,transparent_60%)] opacity-60 blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_45%,rgba(255,255,255,0)_100%)]" />
          <div className="relative z-10"><SignInPage /></div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen flex flex-col text-foreground">
          
          {/* Main Header */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BharatDocs Logo" className="h-8 w-10 object-contain" />
              <span className="font-bold text-xl text-[#F69836]">Bharat</span>
              <span className="text-xl text-[#2F87C7]">Docs</span>
              <span className="ml-2 text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wider">IN</span>
            </div>
            <div className="hidden md:flex items-center relative max-w-md w-full mx-8">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <Input placeholder="Search documents..." className="w-full pl-10 bg-muted/50 border-transparent focus-visible:ring-blue-500 rounded-full h-10 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-9 px-3 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center gap-2">
                <SunIcon className="h-4 w-4 block dark:hidden" />
                <MoonIcon className="h-4 w-4 hidden dark:block" />
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* === FULL TEMPLATE GALLERY OVERLAY === */}
          {isGalleryOpen ? (
            <div className="flex-1 bg-muted/30 dark:bg-muted/10 pb-20">
              <div className="max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-10">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <Button variant="ghost" size="icon" onClick={() => setIsGalleryOpen(false)}>
                    <ArrowLeft className="size-5" />
                  </Button>
                  <h1 className="text-2xl font-medium">Template gallery</h1>
                </div>

                {TEMPLATE_CATEGORIES.map((category) => (
                  <div key={category.category} className="flex flex-col gap-4">
                    <h3 className="text-sm font-medium text-foreground">{category.category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
                      {category.templates.map((template) => (
                        <div key={template.id} className="flex flex-col gap-2 w-[150px] shrink-0 text-left group">
                          <button 
                            onClick={() => onCreateTemplate(template.label, template.initialContent)}
                            className={cn(
                              "aspect-[3/4] w-full bg-card border border-border rounded-md flex items-center justify-center p-4 overflow-hidden relative transition-all duration-150 group-hover:border-blue-500 shadow-sm hover:shadow-md"
                            )}
                          >
                            {template.isBlank ? (
                              <Plus className="size-16 text-red-500 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition" strokeWidth={1} />
                            ) : (
                              <div className="absolute inset-x-2 inset-y-4"><TemplateMockup type={template.id} /></div>
                            )}
                          </button>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground/90 truncate">{template.label}</span>
                            {template.subLabel && <span className="text-xs text-muted-foreground truncate">{template.subLabel}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* === STANDARD START A NEW DOCUMENT RIBBON === */}
              <section className="bg-muted/30 dark:bg-muted/10 print:hidden">
                <main className="max-w-5xl mx-auto p-6 md:px-10 md:py-8 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium text-foreground">Start a new document</h2>
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => setIsGalleryOpen(true)}>
                      Template gallery <ChevronsUpDown className="size-4 opacity-70" />
                    </Button>
                  </div>
                  
                  <div className="flex items-start gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {TEMPLATE_CATEGORIES[0].templates.map((template) => (
                      <div key={template.id} className="flex flex-col gap-2 w-[140px] shrink-0 text-left group">
                        <button 
                          onClick={() => onCreateTemplate(template.label, template.initialContent)}
                          className={cn("aspect-[3/4] w-full bg-card border border-border rounded-md flex items-center justify-center p-4 overflow-hidden relative transition-all duration-150 group-hover:border-blue-500 shadow-sm hover:shadow-md")}
                        >
                          {template.isBlank ? (
                            <Plus className="size-16 text-red-500 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition" strokeWidth={1} />
                          ) : (
                            <div className="absolute inset-x-2 inset-y-4"><TemplateMockup type={template.id} /></div>
                          )}
                        </button>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground/90 truncate">{template.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </main>
              </section>

              {/* === RECENT DOCUMENTS === */}
              <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:px-10 md:py-8 flex flex-col gap-6">
                <h2 className="text-base font-medium text-foreground">Recent documents</h2>

                {documents === undefined ? (
                  <div className="flex items-center justify-center py-20 text-muted-foreground">Loading documents...</div>
                ) : documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-border border-dashed">
                    <FileBox className="w-10 h-10 mb-4 opacity-20" />
                    <p>No documents found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {documents.map((doc) => (
                      <div key={doc._id} onClick={() => (window.location.href = `/documents/${doc._id}`)} className="flex flex-col bg-card border border-border rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer overflow-hidden group">
                        <div className="h-36 bg-muted/30 border-b border-border flex items-center justify-center p-4">
                          <div className="w-full h-full bg-background border border-border/50 shadow-sm rounded flex flex-col gap-2 p-3 overflow-hidden">
                             <div className="w-3/4 h-1.5 bg-muted rounded-full" />
                             <div className="w-full h-1.5 bg-muted rounded-full" />
                             <div className="w-5/6 h-1.5 bg-muted rounded-full" />
                             <div className="w-full h-1.5 bg-muted rounded-full mt-2" />
                             <div className="w-4/5 h-1.5 bg-muted rounded-full" />
                          </div>
                        </div>
                        
                        <div className="p-3 flex items-center justify-between bg-card">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-medium truncate text-foreground group-hover:text-blue-500 transition-colors">{doc.title || "Untitled Document"}</span>
                              <span className="text-[11px] text-muted-foreground truncate font-medium">Opened {new Date(doc._creationTime).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-1 z-50" align="end" onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col gap-0.5">
                                <button onClick={() => window.open(`/documents/${doc._id}`, '_blank')} className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-muted rounded-md text-left transition-colors text-foreground"><ExternalLink className="size-4 text-muted-foreground" /> Open in new tab</button>
                                <button onClick={() => handleCopyLink(doc._id)} className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-muted rounded-md text-left transition-colors text-foreground"><Link2 className="size-4 text-muted-foreground" /> Copy link</button>
                                <div className="h-[1px] bg-border my-1 w-full" />
                                <button onClick={() => handleDelete(doc._id)} className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-red-500/10 text-red-600 rounded-md text-left transition-colors"><Trash2 className="size-4" /> Remove</button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </main>
            </>
          )}
        </div>
      </SignedIn>
    </div>
  );
}