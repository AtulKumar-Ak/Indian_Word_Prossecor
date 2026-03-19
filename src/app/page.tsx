"use client";

import { useMutation, useQuery } from "convex/react";
// This imports the backend API we defined in convex/documents.ts
import { api } from "../../convex/_generated/api"; 
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "./(auth)/signin/signin";
import { useTheme } from "next-themes";
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  SunIcon, 
  MoonIcon, 
  Search,
  FileBox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { theme, setTheme } = useTheme();

  // 1. Hook to fetch your existing documents
  const documents = useQuery(api.documents.get);
  
  // 2. Hook to CREATE a new document
  const createDocument = useMutation(api.documents.create);

  // 3. The function that runs when you click the button
  const onCreate = () => {
    console.log("Button clicked!"); // Debugging log

    createDocument({ title: "Untitled Document" })
      .then((documentId) => {
        console.log("Created document:", documentId);
        // Redirect to the new dynamic ID
        window.location.href = `/documents/${documentId}`;
      })
      .catch((error) => {
        console.error("Error creating document:", error);
        alert("Failed to create: " + error);
      });
  };

  return (
    <div className="min-h-screen">
      
      {/* === SIGNED OUT STATE (Kept exactly as you had it) === */}
      <SignedOut>
        <div className="min-h-screen bg-[#0b0d0f] text-white">
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute -left-24 top-[-140px] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_top,#ffb454,transparent_65%)] opacity-70 blur-2xl" />
            <div className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_top,#44c2ff,transparent_60%)] opacity-60 blur-2xl" />
            <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top,#ff7a7a,transparent_62%)] opacity-60 blur-2xl" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_45%,rgba(255,255,255,0)_100%)]" />
            <div className="relative z-10">
              <SignInPage />
            </div>
          </div>
        </div>
      </SignedOut>

      {/* === SIGNED IN STATE (Upgraded UI) === */}
      <SignedIn>
        <div className="min-h-screen bg-background flex flex-col text-foreground">
          
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card sticky top-0 z-50">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BharatDocs Logo" className="h-8 w-10 object-contain" />
              <span className="font-bold text-xl text-[#F69836]">Bharat</span>
              <span className="text-xl text-[#2F87C7]">Docs</span>
              <span className="ml-2 text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wider">IN</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative max-w-md w-full mx-8">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="w-full pl-10 bg-muted/50 border-transparent focus-visible:ring-blue-500 rounded-full h-10 text-sm"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              
              {/* One-Click Theme Toggle */}
              <Button 
                variant="ghost" 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                className="h-9 px-3 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center gap-2"
              >
                <SunIcon className="h-4 w-4 block dark:hidden" />
                <MoonIcon className="h-4 w-4 hidden dark:block" />
                <span className="text-xs font-medium block dark:hidden">Light</span>
                <span className="text-xs font-medium hidden dark:block">Dark</span>
              </Button>

              {/* Clerk User Profile Button */}
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-12">
            
            {/* "Start a new document" Section */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-medium text-foreground">Start a new document</h2>
              
              <div className="flex items-start gap-6">
                {/* Create Blank Document Button */}
                <div className="flex flex-col gap-2 w-36">
                  <button 
                    onClick={onCreate}
                    className="h-48 w-36 bg-card border border-border rounded-lg hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Plus className="w-12 h-12 text-blue-500 mb-2" strokeWidth={1.5} />
                  </button>
                  <span className="text-sm font-medium text-foreground text-center">Blank document</span>
                </div>
                
                {/* Placeholder Template */}
                <div className="hidden sm:flex items-start gap-6 opacity-50 grayscale cursor-not-allowed">
                  <div className="flex flex-col gap-2 w-36">
                    <div className="h-48 w-36 bg-card border border-border rounded-lg flex items-center justify-center bg-[url('https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png')] bg-cover bg-center border-dashed" />
                    <span className="text-sm font-medium text-foreground text-center">Template gallery</span>
                  </div>
                </div>
              </div>
            </section>

            {/* "Recent Documents" Section */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <h2 className="text-lg font-medium text-foreground">Recent documents</h2>
              </div>

              {documents === undefined ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  Loading documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-border border-dashed">
                  <FileBox className="w-10 h-10 mb-4 opacity-20" />
                  <p>No documents found.</p>
                  <p className="text-sm opacity-70">Create a blank document to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {documents.map((doc) => (
                    <div 
                      key={doc._id}
                      onClick={() => (window.location.href = `/documents/${doc._id}`)}
                      className="flex flex-col bg-card border border-border rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer overflow-hidden group"
                    >
                      {/* Document Thumbnail Mock */}
                      <div className="h-36 bg-muted/30 border-b border-border flex items-center justify-center p-4">
                        <div className="w-full h-full bg-background border border-border/50 shadow-sm rounded flex flex-col gap-2 p-3 overflow-hidden">
                           <div className="w-3/4 h-1.5 bg-muted rounded-full" />
                           <div className="w-full h-1.5 bg-muted rounded-full" />
                           <div className="w-5/6 h-1.5 bg-muted rounded-full" />
                           <div className="w-full h-1.5 bg-muted rounded-full mt-2" />
                           <div className="w-4/5 h-1.5 bg-muted rounded-full" />
                        </div>
                      </div>
                      
                      {/* Document Info */}
                      <div className="p-3 flex items-center justify-between bg-card">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate text-foreground group-hover:text-blue-500 transition-colors">
                              {doc.title || "Untitled Document"}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate font-medium">
                              Opened {new Date(doc._creationTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            alert("More options coming soon!"); 
                          }}
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </main>
        </div>
      </SignedIn>
    </div>
  );
}