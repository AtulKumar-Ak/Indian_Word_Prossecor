"use client";

import { useQuery } from "convex/react";
import { use } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Editor } from "./editor";
import { Room } from "./room";
import { Toolbar } from "./toolbar"; 
import { useEditorStore } from "@/store/use-editor-store"; // Import store
import { Button } from "@/components/ui/button"; // Import your button component
import { EyeOff } from "lucide-react"; // For the exit icon
import { cn } from "@/lib/utils";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const unwrappedParams = use(params);
 const { 
  isPresentationMode, 
  togglePresentationMode, 
  zoom,
  isLandscape
} = useEditorStore();
  const document = useQuery(api.documents.getById, {
    documentId: unwrappedParams.documentId as Id<"documents">,
  });

  if (document === undefined) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (document === null) return <div>Document not found</div>;

  
   return (
  <Room roomId={unwrappedParams.documentId}>
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isPresentationMode
          ? "bg-white dark:bg-black"
          : "bg-background"
      )}
    >
      {/* TOOLBAR */}
      {!isPresentationMode && (
        <div className="flex flex-col px-4 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-background print:hidden border-b border-border">
          <Toolbar />
        </div>
      )}

{/* DOCUMENT AREA */}
<div
  className={cn(
    "transition-all duration-300",
    isPresentationMode ? "pt-1" : "pt-[120px] print:pt-0"
  )}
>
  {/* OUTER WORKSPACE */}
  <div className="flex justify-center py-10 bg-muted/40 dark:bg-neutral-900 min-h-screen">

    {/* SINGLE DOCUMENT PAGE */}
    <div
      className={cn(
        "shadow-2xl transition-all duration-300",
        "bg-white dark:bg-neutral-950",
        isLandscape
          ? "w-[1123px] min-h-[794px]"
          : "w-[794px] min-h-[1123px]"
      )}
      style={{ zoom: zoom / 100 }}
    >
      {/* PAGE CONTENT */}
      <div className="w-full h-full px-20 py-24">
        <Editor />
      </div>
    </div>

  </div>
</div>

      {/* EXIT BUTTON */}
      {isPresentationMode && (
        <Button
          onClick={togglePresentationMode}
          variant="outline"
          className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:bg-slate-100 gap-2 px-6"
        >
          <EyeOff className="size-4" />
          Exit Preview / बंद करें
        </Button>
      )}
    </div>
  </Room>
);
}