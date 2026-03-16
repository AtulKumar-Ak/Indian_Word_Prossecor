"use client";

import { useQuery } from "convex/react";
import { use } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Editor } from "./editor";
import { Room } from "./room";
import { Toolbar } from "./toolbar"; 
import { useEditorStore } from "@/store/use-editor-store"; 
import { Button } from "@/components/ui/button"; 
import { EyeOff } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { AiSidebar } from "@/components/ui/AiSidebar"; // Import your new sidebar

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const unwrappedParams = use(params);
  const { 
    isPresentationMode, 
    togglePresentationMode, 
    zoom,
    isLandscape,
    isAiSidebarOpen // Destructure the new state
  } = useEditorStore();
  
  const document = useQuery(api.documents.getById, {
    documentId: unwrappedParams.documentId as Id<"documents">,
  });

  if (document === undefined) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;
  if (document === null) return <div className="text-foreground">Document not found</div>;

  return (
    <Room roomId={unwrappedParams.documentId}>
      {/* Top Fixed Area (Menu + Toolbar) */}
      {!isPresentationMode && (
        <div className="fixed top-0 left-0 right-0 z-50 shadow-sm print:hidden">
          <Toolbar />
        </div>
      )}

      {/* Main Content Area (Below Toolbar) */}
      <div
        className={cn(
          "flex h-screen w-full overflow-hidden transition-all duration-300",
          isPresentationMode ? "pt-0 bg-white dark:bg-black" : "pt-[96px] bg-background"
        )}
      >
        {/* Editor Workspace (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-muted/40 dark:bg-neutral-900 flex justify-center py-10">
          <div
            className={cn(
              "shadow-2xl transition-all duration-300 h-fit mb-20",
              "bg-white dark:bg-neutral-950",
              isLandscape ? "w-[1123px] min-h-[794px]" : "w-[794px] min-h-[1123px]"
            )}
            style={{ zoom: zoom / 100 }}
          >
            <div className="w-full h-full px-20 py-24">
              <Editor />
            </div>
          </div>
        </div>

        {/* Right Side AI Panel */}
        {!isPresentationMode && isAiSidebarOpen && (
          <AiSidebar />
        )}
      </div>

      {/* Exit Presentation Mode Button */}
      {isPresentationMode && (
        <Button
          onClick={togglePresentationMode}
          variant="outline"
          className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:bg-muted gap-2 px-6"
        >
          <EyeOff className="size-4" />
          Exit Preview
        </Button>
      )}
    </Room>
  );
}