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
import { AiSidebar } from "@/components/ui/AiSidebar"; 

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
    isAiSidebarOpen 
  } = useEditorStore();
  
  const document = useQuery(api.documents.getById, {
    documentId: unwrappedParams.documentId as Id<"documents">,
  });

  if (document === undefined) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;
  if (document === null) return <div className="text-foreground">Document not found</div>;

  return (
    <Room roomId={unwrappedParams.documentId}>
      {/* Root Flex Container */}
      <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
        
        {/* Top Area (Menu + Toolbar) -> Flex Shrink prevents it from collapsing */}
        {!isPresentationMode && (
          <div className="flex-shrink-0 z-50 shadow-sm print:hidden">
            <Toolbar />
          </div>
        )}

        {/* Main Content Area (Shares the remaining space) */}
        <div
          className={cn(
            "flex flex-1 overflow-hidden transition-all duration-300",
            isPresentationMode && "bg-white dark:bg-black"
          )}
        >
          {/* Editor Workspace (Scrollable) */}
          <div className="flex-1 overflow-y-auto bg-muted/40 dark:bg-neutral-900 flex justify-center py-10">
            <div
              className={cn(
                "shadow-2xl transition-all duration-300 h-fit mb-20",
                "bg-white dark:bg-neutral-950",
                // MUCH WIDER SIZES: 950px for portrait, 1200px for landscape
                isLandscape ? "w-[1200px] min-h-[850px]" : "w-[950px] min-h-[1200px]"
              )}
              style={{ zoom: zoom / 100 }}
            >
              {/* MUCH SMALLER PADDING: px-12 gives the text a very wide writing area */}
              <div className="w-full h-full px-12 py-16">
                <Editor />
              </div>
            </div>
          </div>

          {/* Right Side AI Panel */}
          {!isPresentationMode && isAiSidebarOpen && (
            <AiSidebar />
          )}
        </div>
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